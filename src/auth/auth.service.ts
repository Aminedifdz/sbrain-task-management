import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto';
import { VariablesModule } from './../configs';
import { RefreshTokenDto } from './dto';
import { ObjectStringMessageType } from 'src/types';
import { GenerateUUID } from './../helpers';
import { MailService } from './../mail/mail.service';
import { User } from '../resources';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  async isEmailExist(dto: AuthDto) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async signup(dto: AuthDto) {
    // Check if email exist
    if (await this.isEmailExist(dto))
      return { error: 'Email taken!' };
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash,
          verificationToken:
            GenerateUUID.generateUUIDString(),
        },
      });

      const platformOfDeployment =
        VariablesModule.variables.nest_env ===
        'development'
          ? VariablesModule.variables.dev_domaine
          : VariablesModule.variables
              .prod_domaine;

      const apiVersion = '/api/v1';
      const endpointPrefix = `/users`;
      const target = `http://${platformOfDeployment}:${VariablesModule.variables.port_domaine}${apiVersion}${endpointPrefix}/verify/${user.verificationToken}`;

      // send success email
      const emailResponse =
        await this.mailService.sendEmail(
          user.email,
          'Welcome to Our Service',
          'mail/templates/email',
          {
            enterpriseName: 'SBrain',
            link: target,
            email: user.email,
          },
        );

      const tempUser: Partial<User> = user;

      delete tempUser.hash;
      delete tempUser.verificationToken;
      delete tempUser.resetPasswordToken;
      delete tempUser.resetPasswordExpires;

      return {
        data: {
          ...this.signToken(user.id, user.email),
          ...user,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async signin(dto: SignInDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    // compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    const access_token = await this.signToken(
      user.id,
      user.email,
      '5000m',
    );

    const refreshToken = await this.signToken(
      user.id,
      user.email,
      '1500000m',
      // `${VariablesModule.variables.jwt_refresh_token_secret}${VariablesModule.variables.jwt_refresh_token_time_calc}`,
    );

    const refresh_token =
      await this.registerRefreshToken(
        user.id,
        user.email,
        refreshToken,
      );

    return {
      access_token,
      refresh_token,
    };
  }

  async deleteRefreshToken(
    dto: RefreshTokenDto,
  ): Promise<string | ObjectStringMessageType> {
    console.log(
      `refreshToken : ${dto.refreshToken}`,
    );
    const findRecord =
      await this.prisma.refreshToken.findUnique({
        where: {
          token: dto.refreshToken,
        },
      });

    if (!findRecord) {
      return {
        message: 'you are already logged out!',
      };
    }

    const deleteRecord =
      await this.prisma.refreshToken.delete({
        where: {
          id: findRecord.id,
        },
      });

    return deleteRecord
      ? {
          message:
            'refresh token deleted, your logged out!',
        }
      : { message: 'failed to delete!' };
  }

  async valiateRefreshToken(
    dto: RefreshTokenDto,
  ): Promise<string | any> {
    const findRecord =
      await this.prisma.refreshToken.findUnique({
        where: {
          token: dto.refreshToken,
        },
      });

    if (!findRecord) {
      return { message: 'you need to loggin!' };
    }

    const access_token = await this.signToken(
      findRecord.userId || 0,
      findRecord.email || '',
      '5000m',
      // `${VariablesModule.variables.jwt_refresh_token_secret}${VariablesModule.variables.jwt_refresh_token_time_calc}`,
    );

    return { access_token };
  }

  async registerRefreshToken(
    userId: number,
    email: string,
    token: string,
  ): Promise<string> {
    const insertedRecord =
      await this.prisma.refreshToken.upsert({
        where: {
          email,
        },
        create: {
          userId: userId, // Data for creating a new record
          email: email,
          token: token,
        },
        update: {
          token: token, // Data for updating an existing record (only the refresh token in this case)
        },
      });

    return insertedRecord && insertedRecord.token
      ? insertedRecord.token
      : '';
  }

  async signToken(
    userId: number,
    email: string,
    expiresIn?: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret =
      VariablesModule.variables
        .jwt_access_token_secret;

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: expiresIn ?? '3600m',
        secret: secret,
      },
    );

    return token;
  }
}
