import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma 7 requires a driver adapter. Dev runs on SQLite (a local file — zero
 * setup); production runs on MySQL via schema.mysql.prisma (brief §4).
 * Everything the app persists goes through here.
 *
 * The adapter is picked from the connection string rather than hardcoded: the
 * SQLite adapter was fixed here, so the first production container refused to
 * start with "adapter based on sqlite is not compatible with provider mysql" —
 * on a stack that had otherwise built and deployed cleanly.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");

    const isSqlite = url.startsWith("file:") || url.startsWith("sqlite:");
    super({
      adapter: isSqlite
        ? new PrismaBetterSqlite3({ url })
        : new PrismaMariaDb(url),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
