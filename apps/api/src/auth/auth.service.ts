import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { generateSecret, generateURI, verifySync } from "otplib";
import * as QRCode from "qrcode";
import { decrypt, encrypt } from "../crypto/crypto.util";
import { PrismaService } from "../prisma/prisma.service";

const ISSUER = "Mina Ioniță Admin";

export type LoginResult =
  | { twoFactorRequired: true }
  | {
      token: string;
      user: { id: string; email: string; name: string; role: string };
    };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
    code?: string,
  ): Promise<LoginResult> {
    const user = await this.prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Constant-ish time whether or not the user exists.
    const hash =
      user?.passwordHash ??
      "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinva";
    const ok = await bcrypt.compare(password, hash);
    if (!user || !ok)
      throw new UnauthorizedException("Email sau parolă greșite");

    // Enforce 2FA when enabled.
    if (user.totpEnabledAt && user.totpSecretEnc) {
      if (!code) return { twoFactorRequired: true };
      const secret = decrypt(user.totpSecretEnc);
      if (!verifySync({ token: code.trim(), secret }).valid) {
        throw new UnauthorizedException("Cod 2FA greșit");
      }
    }

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        totpEnabledAt: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    return { ...user, twoFactorEnabled: !!user.totpEnabledAt };
  }

  // ── 2FA setup ──────────────────────────────────────────────────────────
  /** Generate a secret, store it encrypted (not yet enabled), return the QR. */
  async startTwoFactor(userId: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException();
    if (user.totpEnabledAt)
      throw new BadRequestException("2FA e deja activat.");

    // otplib's generateSecret is synchronous — it returns the string, not a promise.
    const secret = generateSecret();
    await this.prisma.adminUser.update({
      where: { id: userId },
      data: { totpSecretEnc: encrypt(secret) },
    });

    const uri = generateURI({ secret, label: user.email, issuer: ISSUER });
    const qr = await QRCode.toDataURL(uri);
    return { qr, uri };
  }

  /** Verify the first code to prove the user set up their authenticator. */
  async confirmTwoFactor(userId: string, code: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
    });
    if (!user?.totpSecretEnc)
      throw new BadRequestException("Pornește întâi configurarea 2FA.");
    const secret = decrypt(user.totpSecretEnc);
    if (!verifySync({ token: code.trim(), secret }).valid) {
      throw new BadRequestException("Cod greșit. Mai încearcă.");
    }
    await this.prisma.adminUser.update({
      where: { id: userId },
      data: { totpEnabledAt: new Date() },
    });
    return { enabled: true };
  }

  async disableTwoFactor(userId: string, code: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
    });
    if (!user?.totpEnabledAt || !user.totpSecretEnc) {
      throw new BadRequestException("2FA nu e activat.");
    }
    const secret = decrypt(user.totpSecretEnc);
    if (!verifySync({ token: code.trim(), secret }).valid) {
      throw new BadRequestException("Cod greșit.");
    }
    await this.prisma.adminUser.update({
      where: { id: userId },
      data: { totpEnabledAt: null, totpSecretEnc: null },
    });
    return { enabled: false };
  }
}
