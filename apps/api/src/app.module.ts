import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ConsentModule } from "./consent/consent.module";
import { ContentModule } from "./content/content.module";
import { ContractsModule } from "./contracts/contracts.module";
import { LeadsModule } from "./leads/leads.module";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProjectsModule } from "./projects/projects.module";
import { SettingsModule } from "./settings/settings.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    // Rate limiting (brief §7). Generous globally so it never chokes the SSR
    // content fetches; login is throttled tightly via @Throttle on its route.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 200 }]),
    PrismaModule,
    AuthModule,
    ConsentModule,
    ContentModule,
    ContractsModule,
    LeadsModule,
    MonitoringModule,
    ProjectsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
