import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { VariablesModule } from './../../configs';
import { User } from '../../resources';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: config.get('JWT_ACCESS_TOKEN_SECRET'),
      secretOrKey:
        VariablesModule.variables
          .jwt_access_token_secret,
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
        include: {
          Task: true,
        },
      });

    const tempUser: Partial<User> | null = user;

    if (tempUser) delete tempUser.hash;
    return tempUser;
  }
}
