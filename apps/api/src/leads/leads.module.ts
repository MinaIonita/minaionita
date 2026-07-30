import { Module } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import { LeadsController } from "./leads.controller";
import { LeadsService } from "./leads.service";

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, MailService],
})
export class LeadsModule {}
