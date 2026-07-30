import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { type TicketStatus } from "@prisma/client";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";

export type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  budget?: string;
  serviceSlug?: string;
  // Attribution captured from the request (brief §5ter).
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
  referrer?: string;
  ip?: string;
  userAgent?: string;
};

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  /** Every form submission becomes a ticket (brief §5ter) and an email to the
   *  owner's inbox, so a lead is never sitting unseen in the admin. */
  async create(input: LeadInput) {
    const service = input.serviceSlug
      ? await this.prisma.service.findFirst({
          where: { slug: input.serviceSlug },
          select: { id: true },
        })
      : null;

    const lead = await this.prisma.lead.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase().trim(),
        phone: input.phone,
        message: input.message,
        budget: input.budget,
        serviceId: service?.id,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        utmTerm: input.utmTerm,
        utmContent: input.utmContent,
        landingPage: input.landingPage,
        referrer: input.referrer,
        ip: input.ip,
        userAgent: input.userAgent,
      },
      select: { id: true },
    });

    // Notification is best-effort: a mail outage must never lose the lead, which
    // is already persisted above.
    try {
      await this.mail.notify(
        `Cerere nouă de pe site — ${input.name}`,
        this.notificationBody(input),
        input.email,
      );
    } catch (err) {
      this.logger.error(
        `Lead ${lead.id} saved but notification email failed: ${String(err)}`,
      );
    }

    return lead;
  }

  /** Plain-text summary of a submission, ordered the way it gets read. */
  private notificationBody(input: LeadInput) {
    const lines = [
      `Nume:     ${input.name}`,
      `Email:    ${input.email}`,
      input.phone && `Telefon:  ${input.phone}`,
      input.serviceSlug && `Serviciu: ${input.serviceSlug}`,
      input.budget && `Buget:    ${input.budget}`,
      "",
      "Mesaj:",
      input.message?.trim() || "(fără mesaj)",
      "",
      "— Atribuire —",
      input.landingPage && `Pagina:   ${input.landingPage}`,
      input.utmSource && `Sursă:    ${input.utmSource}`,
      input.utmMedium && `Mediu:    ${input.utmMedium}`,
      input.utmCampaign && `Campanie: ${input.utmCampaign}`,
      input.utmTerm && `Termen:   ${input.utmTerm}`,
      input.utmContent && `Conținut: ${input.utmContent}`,
      input.referrer && `Referrer: ${input.referrer}`,
      input.ip && `IP:       ${input.ip}`,
    ];
    return lines.filter(Boolean).join("\n");
  }

  list(status?: TicketStatus) {
    return this.prisma.lead.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: { service: { select: { title: true } } },
    });
  }

  async get(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        service: { select: { title: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!lead) throw new NotFoundException();
    return lead;
  }

  async updateStatus(id: string, status: TicketStatus) {
    await this.get(id);
    return this.prisma.lead.update({ where: { id }, data: { status } });
  }

  /** Reply from admin: save to the thread, email the client (if SMTP set),
   *  and move the ticket to REPLIED (brief §5ter). */
  async reply(id: string, body: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException();

    const sent = await this.mail.send(
      lead.email,
      `Re: cererea ta către Mina Ioniță`,
      body,
    );

    await this.prisma.$transaction([
      this.prisma.ticketMessage.create({
        data: { leadId: id, direction: "OUTBOUND", body },
      }),
      this.prisma.lead.update({ where: { id }, data: { status: "REPLIED" } }),
    ]);

    return { sent };
  }

  /** One-click: a won ticket becomes a client project, keeping the thread
   *  attached (brief §5ter). */
  async convertToProject(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException();
    if (lead.clientProjectId) {
      return { projectId: lead.clientProjectId, already: true };
    }

    const project = await this.prisma.clientProject.create({
      data: {
        clientName: lead.name,
        contactEmail: lead.email,
        contactPhone: lead.phone,
        stage: "QUOTED",
        notes: lead.message ?? undefined,
      },
    });

    await this.prisma.lead.update({
      where: { id },
      data: { clientProjectId: project.id, status: "WON" },
    });

    return { projectId: project.id, already: false };
  }
}
