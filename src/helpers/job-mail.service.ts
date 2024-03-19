import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessorService {
  @Process('send')
  async sendEmail(job: Job<unknown>) {
    // Logic to send email goes here
  }
}
