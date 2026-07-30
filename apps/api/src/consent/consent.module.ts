import {
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  Module,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Consent log (brief §5ter): evidence that a visitor was asked and what they
 * answered. Append-only by design — a log you can edit isn't evidence.
 *
 * It stores an anonymous visitor id from the banner plus ip/ua, which is the
 * minimum needed to tie a record to a request. Nothing identifying comes from
 * the form side.
 */
@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: {
    visitorId: string;
    analytics: boolean;
    marketing: boolean;
    ip?: string;
    userAgent?: string;
  }) {
    return this.prisma.consentLog.create({
      data: {
        visitorId: input.visitorId,
        necessary: true,
        analytics: input.analytics,
        marketing: input.marketing,
        ip: input.ip,
        userAgent: input.userAgent,
      },
      select: { id: true },
    });
  }

  /** Admin view: most recent decisions first. */
  list(limit = 100) {
    return this.prisma.consentLog.findMany({
      orderBy: { at: "desc" },
      take: Math.min(Math.max(limit, 1), 500),
    });
  }
}

class RecordConsentDto {
  @IsString() @MaxLength(64) visitorId!: string;
  @IsOptional() @IsBoolean() analytics?: boolean;
  @IsOptional() @IsBoolean() marketing?: boolean;
}

@Controller("consent")
export class ConsentController {
  constructor(private readonly consent: ConsentService) {}

  // Public: the cookie banner posts here through the site's own route. A visitor
  // may legitimately change their mind a few times; nobody needs 200/min.
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Post()
  @HttpCode(204)
  async record(@Body() dto: RecordConsentDto, @Req() req: Request) {
    await this.consent.record({
      visitorId: dto.visitorId,
      analytics: dto.analytics === true,
      marketing: dto.marketing === true,
      ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0] ?? req.ip,
      userAgent: req.get("user-agent") ?? undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Query("limit") limit?: string) {
    return this.consent.list(limit ? Number(limit) : undefined);
  }
}

@Module({
  controllers: [ConsentController],
  providers: [ConsentService],
})
export class ConsentModule {}
