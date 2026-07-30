import {
  Controller,
  Get,
  Module,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MailService } from "../mail/mail.service";
import { MonitoringService } from "./monitoring.service";

@UseGuards(JwtAuthGuard)
@Controller("admin/monitoring")
export class MonitoringController {
  constructor(private readonly monitoring: MonitoringService) {}

  // Live status for all client sites (uptime + expiry countdowns).
  @Get("status")
  status() {
    return this.monitoring.status();
  }

  // Projects with an expiry within 30 days or currently down — the alert badge.
  @Get("expiring")
  expiring() {
    return this.monitoring.expiring();
  }

  // Re-read the live TLS certificate expiry for one project.
  @Post(":id/ssl")
  refreshSsl(@Param("id") id: string) {
    return this.monitoring.refreshSsl(id);
  }
}

@Module({
  controllers: [MonitoringController],
  providers: [MonitoringService, MailService],
})
export class MonitoringModule {}
