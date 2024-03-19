import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, of, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TaskCacheInterceptor
  implements NestInterceptor
{
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest();

    // const userId = request.user.id; // Assume you have a way to identify the user
    // Extract the userId from the request object
    const userId = request.user?.id;
    if (!userId) {
      // If there's no userId, just proceed without caching
      return next.handle();
    }

    const cacheKey = !request.params?.id
      ? request.query && request.query?.cursorId
        ? `/api/v1/tasks/user:${userId}/&cursorId=${request.query?.cursorId}&pageSize=${request.query?.pageSize}&sort=${request.query?.sort}&dueDate=${request.query?.dueDate}&status=${request.query?.status}`
        : `/api/v1/tasks/user:${userId}/&page=${request.query?.page}&pageSize=${request.query?.pageSize}&sort=${request.query?.sort}&dueDate=${request.query?.dueDate}&status=${request.query?.status}`
      : `/api/v1/tasks/user:${userId}/${request.params?.id}`;

    return from(
      this.cacheManager.get(cacheKey),
    ).pipe(
      switchMap((cachedData) => {
        if (cachedData) {
          return of(cachedData);
        } else {
          return next.handle().pipe(
            tap((data) => {
              this.cacheManager.set(
                cacheKey,
                data,
                300,
              );
            }),
          );
        }
      }),
    );
  }
}
