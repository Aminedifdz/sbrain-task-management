import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import {
  EditUserDto,
  GetResetPasswordDto,
  ResetPasswordDto,
  RequestPasswordDto,
} from './dto';
import { GenerateUUID } from './../helpers';
import { VariablesModule } from './../configs';
import { MailService } from './../mail/mail.service';
import { User } from '../resources';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async editUser(
    userId: number,
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    const tempUser: Partial<User> = user;
    delete tempUser.hash;

    return tempUser;
  }

  async verifyUser(verificationToken: string) {
    const findRecord =
      await this.prisma.user.findFirst({
        where: {
          verificationToken: verificationToken,
        },
      });

    if (
      !findRecord ||
      findRecord.verificationToken !==
        verificationToken ||
      findRecord.verificationToken === '' ||
      typeof verificationToken !== 'string'
    ) {
      // return {
      //   message: `verification failed`,
      // };

      return `verification failed`;
    }

    const updatedRecord =
      await this.prisma.user.update({
        where: {
          id: findRecord.id,
        },
        data: {
          verificationToken: '',
          isVerified: true,
        },
      });

    const tempUpdatedRecord: Partial<User> =
      updatedRecord;

    delete tempUpdatedRecord.hash;
    delete tempUpdatedRecord.verificationToken;
    delete tempUpdatedRecord.resetPasswordExpires;
    delete tempUpdatedRecord.resetPasswordToken;

    // to respond with an email
    // return {
    //   message: `verified successfully done!`,
    // };
    return `verified successfully done!`;
  }

  async getResetPassword(
    id: number,
    resetPasswordToken: string,
    dto: GetResetPasswordDto,
  ) {
    const platformOfDeployment =
      VariablesModule.variables.nest_env ===
      'development'
        ? VariablesModule.variables.dev_domaine
        : VariablesModule.variables.prod_domaine;

    const apiVersion = '/api/v1';
    const endpointPrefix = `/users`;

    const target = `http://${platformOfDeployment}:${process.env.PORT_DOMAIN}${apiVersion}${endpointPrefix}/reset_password`;

    return {
      link: target,
      resetPasswordToken: resetPasswordToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const findUser =
      await this.prisma.user.findUnique({
        where: {
          resetPasswordToken:
            dto.resetPasswordToken,
        },
      });
    console.log(`dto service`, dto);

    if (
      !findUser ||
      dto.password != dto.confirmPassword
    ) {
      // return {
      //   message: `Not reseting password`,
      // };

      console.log(`findUser`, dto.password);
      console.log(
        `findUser`,
        dto.confirmPassword,
      );

      return `Failed reseting password`;
    }

    const updatedUser =
      findUser &&
      BigInt(findUser.resetPasswordExpires || 0) >
        Date.now()
        ? await this.prisma.user.update({
            where: {
              id: findUser.id,
            },
            data: {
              hash: await argon.hash(
                dto.password,
              ),
              resetPasswordToken: null,
              resetPasswordExpires: null,
            },
          })
        : null;

    if (updatedUser) {
      const date_ob = new Date();
      const date1 = (
        '0' + date_ob.getDate()
      ).slice(-2);
      const month = (
        '0' +
        (date_ob.getMonth() + 1)
      ).slice(-2);
      const year = date_ob.getFullYear();
      const hours = date_ob.getHours();
      const minutes = date_ob.getMinutes();
      const seconds = date_ob.getSeconds();

      const date =
        year +
        '-' +
        month +
        '-' +
        date1 +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds;

      const emailResponse =
        await this.mailService.sendEmail(
          updatedUser.email,
          'Reset password!',
          'mail/templates/password-reset-successfully',
          {
            msg: '`your password changed 🧡`',
            date,
          },
        );
    }
    /************ END ************************/

    // to respond with an email
    // return {
    //   message: `password reset!`,
    // };

    return `password reset`;
  }

  async requestPasswordReset(
    dto: RequestPasswordDto,
  ) {
    /************ BEGIN **********************/
    const bigIntValue = Date.now() + 3600000;
    const resetPasswordExpire =
      bigIntValue.toString();

    const resetPasswordToken =
      GenerateUUID.generateUUIDString();

    const updatedUser =
      await this.prisma.user.update({
        where: {
          email: dto.email,
        },
        data: {
          resetPasswordToken,
          resetPasswordExpires:
            resetPasswordExpire,
        },
      });

    const platformOfDeployment =
      VariablesModule.variables.nest_env ===
      'development'
        ? VariablesModule.variables.dev_domaine
        : VariablesModule.variables.prod_domaine;

    const apiVersion = '/api/v1';
    const endpointPrefix = `/users`;
    const target = `http://${platformOfDeployment}:${VariablesModule.variables.port_domaine}${apiVersion}${endpointPrefix}/get_reset_password/${updatedUser.id}/${resetPasswordToken}`;

    if (
      updatedUser &&
      updatedUser.resetPasswordExpires
    ) {
      const emailResponse =
        await this.mailService.sendEmail(
          updatedUser.email,
          'Request password change',
          // 'mail/templates/password-reset-email',
          './mail/templates/password-reset-email',
          {
            email: updatedUser.email,
            link: target,
            resetToken:
              updatedUser.resetPasswordToken,
          },
        );
    }
    /************ END ************************/

    const tempUpdatedUser: Partial<User> =
      updatedUser;

    delete tempUpdatedUser.hash;
    delete tempUpdatedUser.verificationToken;
    delete tempUpdatedUser.resetPasswordExpires;
    delete tempUpdatedUser.resetPasswordToken;

    // to respond with an email
    return {
      message: `password change requested!`,
      data: { ...tempUpdatedUser },
    };
  }
}
