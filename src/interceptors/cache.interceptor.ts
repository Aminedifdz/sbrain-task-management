import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CacheIgnoreRoutes } from './../helpers';

@Injectable()
export class MyCacheInterceptor extends CacheInterceptor {
  excludePathsPatterns =
    CacheIgnoreRoutes.excludePathsPatterns;

  isRequestCacheable(
    context: ExecutionContext,
  ): boolean {
    const req = context
      .switchToHttp()
      .getRequest();

    const urlMatchesExcludedPath =
      this.excludePathsPatterns.some((pattern) =>
        pattern.test(req.url),
      );

    return (
      this.allowedMethods.includes(req.method) &&
      !urlMatchesExcludedPath
    );
  }
}
