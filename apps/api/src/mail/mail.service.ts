import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

/**
 * Outbound mail for ticket replies and new-lead notifications (brief §5ter). If
 * SMTP_URL isn't configured, it degrades gracefully: the reply is still saved to
 * the ticket thread, and we log what would have been sent. Configure SMTP_URL +
 * MAIL_FROM to go live.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private get from() {
    return process.env.MAIL_FROM ?? "contact@minaionita.ro";
  }

  /** Inbox that receives every contact-form submission. */
  get notifyTo() {
    return process.env.CONTACT_NOTIFY_EMAIL ?? "mina.ionita1@gmail.com";
  }

  private getTransport(): nodemailer.Transporter | null {
    if (this.transporter) return this.transporter;
    const url = process.env.SMTP_URL;
    if (!url) return null;
    this.transporter = nodemailer.createTransport(url);
    return this.transporter;
  }

  /** Returns true if the mail was actually dispatched, false if SMTP is unset. */
  async send(
    to: string,
    subject: string,
    text: string,
    opts?: { replyTo?: string },
  ): Promise<boolean> {
    const transport = this.getTransport();
    if (!transport) {
      this.logger.warn(
        `SMTP not configured — reply saved but NOT emailed. To: ${to} · ${subject}`,
      );
      return false;
    }
    await transport.sendMail({
      from: this.from,
      to,
      subject,
      text,
      replyTo: opts?.replyTo,
    });
    return true;
  }

  /**
   * Notify the owner's inbox. replyTo is the visitor's address, so hitting Reply
   * in Gmail answers the lead directly instead of the site's own from-address.
   */
  async notify(subject: string, text: string, replyTo?: string) {
    return this.send(this.notifyTo, subject, text, { replyTo });
  }
}
