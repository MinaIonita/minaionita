import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { TicketStatus } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { LeadsService } from "./leads.service";

class CreateLeadDto {
  @IsString() @MaxLength(120) name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(4000) message?: string;
  @IsOptional() @IsString() @MaxLength(80) budget?: string;
  @IsOptional() @IsString() @MaxLength(120) serviceSlug?: string;
  // The front forwards these from the browser; server captures ip/ua/referrer.
  @IsOptional() @IsString() utmSource?: string;
  @IsOptional() @IsString() utmMedium?: string;
  @IsOptional() @IsString() utmCampaign?: string;
  @IsOptional() @IsString() utmTerm?: string;
  @IsOptional() @IsString() utmContent?: string;
  @IsOptional() @IsString() landingPage?: string;
}

class UpdateStatusDto {
  @IsEnum(TicketStatus) status!: TicketStatus;
}

class ReplyDto {
  @IsString() @MaxLength(8000) body!: string;
}

@Controller("leads")
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  /**
   * Public: the site's contact form posts here.
   *
   * The global limit (200/min) is sized for SSR content fetches and is far too
   * loose for a form that writes a row and sends an email on every hit. Five
   * submissions per ten minutes per IP is generous for a real visitor and closes
   * the door on a script.
   */
  @Throttle({ default: { limit: 5, ttl: 600_000 } })
  @Post()
  create(@Body() dto: CreateLeadDto, @Req() req: Request) {
    return this.leads.create({
      ...dto,
      referrer: req.get("referer") ?? undefined,
      userAgent: req.get("user-agent") ?? undefined,
      ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0] ?? req.ip,
    });
  }

  // Admin inbox.
  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Query("status") status?: TicketStatus) {
    return this.leads.list(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  get(@Param("id") id: string) {
    return this.leads.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() dto: UpdateStatusDto) {
    return this.leads.updateStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/reply")
  reply(@Param("id") id: string, @Body() dto: ReplyDto) {
    return this.leads.reply(id, dto.body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/convert")
  convert(@Param("id") id: string) {
    return this.leads.convertToProject(id);
  }
}
