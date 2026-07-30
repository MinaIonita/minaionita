import {
  Body,
  Controller,
  Get,
  Injectable,
  Module,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IsObject } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Global settings as key/value Json: contact details, menus, footer, tracking
 * IDs (brief §4, §5ter). Editable from admin, read by the public site.
 *
 * Keys the public site is allowed to read. Everything else — SMTP config, API
 * keys, anything an admin pastes into a settings field later — stays behind
 * auth. The unfiltered GET used to be public, which made this table a
 * world-readable dump the moment one sensitive value landed in it.
 */
const PUBLIC_KEYS = new Set(["site", "cta"]);

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async all() {
    const rows = await this.prisma.setting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  /** Whitelisted subset for the public site. */
  async publicOnly() {
    const rows = await this.prisma.setting.findMany({
      where: { key: { in: [...PUBLIC_KEYS] } },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  set(key: string, value: Prisma.InputJsonValue) {
    return this.prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }
}

class SetSettingDto {
  @IsObject() value!: Prisma.InputJsonValue;
}

@Controller("settings")
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  /** Public: only whitelisted keys. The site reads this on every SSR render. */
  @Get()
  publicSettings() {
    return this.settings.publicOnly();
  }

  /** Admin: the full table, for the settings screen. */
  @UseGuards(JwtAuthGuard)
  @Get("all")
  all() {
    return this.settings.all();
  }

  @UseGuards(JwtAuthGuard)
  @Put(":key")
  set(@Param("key") key: string, @Body() dto: SetSettingDto) {
    return this.settings.set(key, dto.value);
  }
}

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
