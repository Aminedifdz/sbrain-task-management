export class CacheIgnoreRoutes {
  static excludePathsPatterns = [
    /^\/api\/v1\/users\/verify\/.+$/,
    /^\/api\/v1\/tasks(\?.*)?$/, // To ignore all tasks route pattern
    /^\/api\/v1\/tasks(?:\/|$)/,
  ];
}
