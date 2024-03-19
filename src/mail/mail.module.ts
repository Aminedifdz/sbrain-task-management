import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { VariablesModule } from '../configs';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Paths } from './../helpers';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: VariablesModule.variables
          .email_smtp,
        port: Number(
          VariablesModule.variables.email_port,
        ),
        secure: false,
        auth: {
          user: VariablesModule.variables
            .email_user,
          pass: VariablesModule.variables
            .email_app_password,
        },
      },
      defaults: {
        from: VariablesModule.variables
          .email_default,
      },
      template: {
        // dir: Paths.getParentDir(__dirname),
        dir: Paths.getParentDir(__dirname).split(
          'src',
        )[0],
        // adapter: new HandlebarsAdapter(),
        adapter: new EjsAdapter(),
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
