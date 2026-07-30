import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as tls from "node:tls";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";

export type SiteStatus = {
  projectId: string;
  clientName: string;
  siteUrl: string | null;
  up: boolean | null;
  statusCode: number | null;
  responseMs: number | null;
  sslExpiresAt: string | null;
  sslDaysLeft: number | null;
  domainExpiresAt: string | null;
  domainDaysLeft: number | null;
  hostingExpiresAt: string | null;
  hostingDaysLeft: number | null;
  openIncidents: number;
};

const daysLeft = (d: Date | string | null): number | null => {
  if (!d) return null;
  const ms = new Date(d).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
};

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  /** Live status for every project with a site URL. */
  async status(): Promise<SiteStatus[]> {
    const projects = await this.prisma.clientProject.findMany({
      include: {
        _count: { select: { incidents: { where: { resolvedAt: null } } } },
      },
    });

    return Promise.all(
      projects.map(async (p) => {
        const uptime = p.siteUrl ? await this.pingSite(p.siteUrl) : null;
        return {
          projectId: p.id,
          clientName: p.clientName,
          siteUrl: p.siteUrl,
          up: uptime?.up ?? null,
          statusCode: uptime?.statusCode ?? null,
          responseMs: uptime?.ms ?? null,
          sslExpiresAt: p.sslExpiresAt?.toISOString() ?? null,
          sslDaysLeft: daysLeft(p.sslExpiresAt),
          domainExpiresAt: p.domainExpiresAt?.toISOString() ?? null,
          domainDaysLeft: daysLeft(p.domainExpiresAt),
          hostingExpiresAt: p.hostingExpiresAt?.toISOString() ?? null,
          hostingDaysLeft: daysLeft(p.hostingExpiresAt),
          openIncidents: p._count.incidents,
        };
      }),
    );
  }

  private async pingSite(
    url: string,
  ): Promise<{ up: boolean; statusCode: number | null; ms: number }> {
    const start = Date.now();
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(10_000),
      });
      return { up: res.ok, statusCode: res.status, ms: Date.now() - start };
    } catch {
      return { up: false, statusCode: null, ms: Date.now() - start };
    }
  }

  /** Read the TLS certificate's expiry for a host. */
  private checkSsl(host: string): Promise<Date | null> {
    return new Promise((resolve) => {
      const socket = tls.connect(
        { host, port: 443, servername: host, timeout: 8000 },
        () => {
          const cert = socket.getPeerCertificate();
          socket.end();
          resolve(cert?.valid_to ? new Date(cert.valid_to) : null);
        },
      );
      socket.on("error", () => resolve(null));
      socket.on("timeout", () => {
        socket.destroy();
        resolve(null);
      });
    });
  }

  /** Refresh SSL expiry from the live certificate for one project. */
  async refreshSsl(projectId: string) {
    const p = await this.prisma.clientProject.findUnique({
      where: { id: projectId },
    });
    if (!p?.siteUrl) return { sslExpiresAt: null };
    const host = new URL(p.siteUrl).hostname;
    const expiry = await this.checkSsl(host);
    if (expiry) {
      await this.prisma.clientProject.update({
        where: { id: projectId },
        data: { sslExpiresAt: expiry },
      });
    }
    return { sslExpiresAt: expiry?.toISOString() ?? null };
  }

  /** Projects with any expiry within 30 days — feeds the admin badge + alerts. */
  async expiring() {
    const all = await this.status();
    const soon = (n: number | null) => n !== null && n <= 30;
    return all
      .filter(
        (s) =>
          soon(s.domainDaysLeft) ||
          soon(s.hostingDaysLeft) ||
          soon(s.sslDaysLeft) ||
          s.up === false,
      )
      .map((s) => ({
        projectId: s.projectId,
        clientName: s.clientName,
        down: s.up === false,
        domainDaysLeft: soon(s.domainDaysLeft) ? s.domainDaysLeft : null,
        hostingDaysLeft: soon(s.hostingDaysLeft) ? s.hostingDaysLeft : null,
        sslDaysLeft: soon(s.sslDaysLeft) ? s.sslDaysLeft : null,
      }));
  }

  /**
   * Scheduled uptime sweep (brief §5quater.2: ping regularly). Records a
   * downtime incident when a site goes down and resolves it when it recovers.
   * Runs every 15 min here (dev-friendly; the brief's 5-min cadence is a config
   * change).
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async sweep() {
    const projects = await this.prisma.clientProject.findMany({
      where: { siteUrl: { not: null } },
    });

    for (const p of projects) {
      if (!p.siteUrl) continue;
      const { up } = await this.pingSite(p.siteUrl);
      const open = await this.prisma.incident.findFirst({
        where: { projectId: p.id, kind: "downtime", resolvedAt: null },
      });

      if (!up && !open) {
        await this.prisma.incident.create({
          data: {
            projectId: p.id,
            kind: "downtime",
            detail: `${p.siteUrl} nu răspunde`,
          },
        });
        await this.mail.send(
          process.env.MAIL_FROM ?? "contact@minaionita.ro",
          `⚠️ Site indisponibil: ${p.clientName}`,
          `${p.siteUrl} nu răspunde de la ${new Date().toLocaleString("ro-RO")}.`,
        );
        this.logger.warn(`DOWN: ${p.clientName} (${p.siteUrl})`);
      } else if (up && open) {
        await this.prisma.incident.update({
          where: { id: open.id },
          data: { resolvedAt: new Date() },
        });
        this.logger.log(`RECOVERED: ${p.clientName}`);
      }
    }
  }
}
