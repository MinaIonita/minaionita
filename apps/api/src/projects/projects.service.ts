import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { decrypt, encrypt } from "../crypto/crypto.util";
import { PrismaService } from "../prisma/prisma.service";

export type CredentialInput = {
  label: string;
  username?: string;
  password?: string;
  loginUrl?: string;
  note?: string;
};

/** Private "Date proiecte" module + credential vault (brief §5). Passwords are
 *  AES-256 encrypted at rest and only ever leave masked; a dedicated reveal
 *  endpoint decrypts one at a time and logs the access (§7). */
@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.clientProject.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { credentials: true } } },
    });
  }

  /** Full project with credentials — but passwords stay masked (never decrypted here). */
  async get(id: string) {
    const p = await this.prisma.clientProject.findUnique({
      where: { id },
      include: {
        credentials: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            label: true,
            username: true,
            loginUrl: true,
            note: true,
            // passwordEnc deliberately omitted — reveal endpoint only.
          },
        },
      },
    });
    if (!p) throw new NotFoundException();
    return p;
  }

  create(data: Prisma.ClientProjectCreateInput) {
    return this.prisma.clientProject.create({ data });
  }

  async update(id: string, data: Prisma.ClientProjectUpdateInput) {
    await this.exists(id);
    return this.prisma.clientProject.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.exists(id);
    return this.prisma.clientProject.delete({ where: { id } });
  }

  // ── Credentials ─────────────────────────────────────────────────────────
  async addCredential(projectId: string, input: CredentialInput) {
    await this.exists(projectId);
    return this.prisma.credential.create({
      data: {
        projectId,
        label: input.label,
        username: input.username,
        loginUrl: input.loginUrl,
        note: input.note,
        passwordEnc: input.password ? encrypt(input.password) : encrypt(""),
      },
      select: { id: true, label: true },
    });
  }

  async updateCredential(id: string, input: CredentialInput) {
    const cred = await this.prisma.credential.findUnique({ where: { id } });
    if (!cred) throw new NotFoundException();
    return this.prisma.credential.update({
      where: { id },
      data: {
        label: input.label,
        username: input.username,
        loginUrl: input.loginUrl,
        note: input.note,
        // Only re-encrypt when a new password is actually provided.
        ...(input.password !== undefined
          ? { passwordEnc: encrypt(input.password) }
          : {}),
      },
      select: { id: true, label: true },
    });
  }

  async removeCredential(id: string) {
    const cred = await this.prisma.credential.findUnique({ where: { id } });
    if (!cred) throw new NotFoundException();
    return this.prisma.credential.delete({ where: { id } });
  }

  /** Decrypt one password and log who saw it (§7: jurnalizare accese). */
  async reveal(id: string, userId: string, ip?: string) {
    const cred = await this.prisma.credential.findUnique({ where: { id } });
    if (!cred) throw new NotFoundException();

    await this.prisma.accessLog.create({
      data: {
        userId,
        action: "reveal_credential",
        entity: "Credential",
        entityId: id,
        ip,
      },
    });

    return { password: decrypt(cred.passwordEnc) };
  }

  private async exists(id: string) {
    const p = await this.prisma.clientProject.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!p) throw new NotFoundException();
  }
}
