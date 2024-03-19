import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './middlewares';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { VariablesModule } from './configs';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { MyCacheInterceptor } from './interceptors';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: VariablesModule.variables
        .redis_docker_host,
      port: VariablesModule.variables.redis_port,
      auth_pass:
        VariablesModule.variables.redis_password,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host:
            VariablesModule.variables
              .redis_host || '172.17.0.1',
          port:
            Number(
              VariablesModule.variables
                .redis_exposing_port,
            ) || 6379,
          password:
            VariablesModule.variables
              .redis_password || '',
        },
      }),
    }),
    AuthModule,
    UserModule,
    TaskModule,
    PrismaModule,
    MailModule,
    RedisModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MyCacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }

  async onModuleInit(): Promise<void> {
    console.log(`Server started ... `);

    // Console the mode
    console.log(
      `Server launched on ${VariablesModule.variables.nest_env} mode`,
    );

    console.log(
      `Listening on port ${VariablesModule.variables.port_domaine}`,
    );
  }
}
