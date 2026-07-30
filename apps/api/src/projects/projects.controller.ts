import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { IsOptional, IsString, MaxLength } from "class-validator";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ProjectsService } from "./projects.service";

class CredentialDto {
  @IsString() @MaxLength(120) label!: string;
  @IsOptional() @IsString() @MaxLength(255) username?: string;
  @IsOptional() @IsString() @MaxLength(500) password?: string;
  @IsOptional() @IsString() @MaxLength(500) loginUrl?: string;
  @IsOptional() @IsString() @MaxLength(2000) note?: string;
}

type Req2 = { user: { userId: string } } & Request;

// Everything here is admin-only and private (brief §5).
@UseGuards(JwtAuthGuard)
@Controller("admin/projects")
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  list() {
    return this.projects.list();
  }

  @Post()
  create(@Body() data: Prisma.ClientProjectCreateInput) {
    return this.projects.create(data);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.projects.get(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() data: Prisma.ClientProjectUpdateInput,
  ) {
    return this.projects.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projects.remove(id);
  }

  // ── Credentials ──
  @Post(":id/credentials")
  addCredential(@Param("id") projectId: string, @Body() dto: CredentialDto) {
    return this.projects.addCredential(projectId, dto);
  }
}

@UseGuards(JwtAuthGuard)
@Controller("admin/credentials")
export class CredentialsController {
  constructor(private readonly projects: ProjectsService) {}

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: CredentialDto) {
    return this.projects.updateCredential(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projects.removeCredential(id);
  }

  // Decrypt a single password (logged). POST, not GET, so it stays out of logs/caches.
  @Post(":id/reveal")
  reveal(@Param("id") id: string, @Req() req: Req2) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ?? req.ip;
    return this.projects.reveal(id, req.user.userId, ip);
  }
}
