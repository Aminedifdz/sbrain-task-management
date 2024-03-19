import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: object,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: to,
      subject: subject,
      template: template, // name of the template file without extension
      // context: context, // variables for the template
      context: { ...context }, // variables for the template
    });
  }
}
