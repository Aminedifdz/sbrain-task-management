import { SetMetadata } from '@nestjs/common';

export const EXCLUDE_CACHE_KEY = 'excludeCache';

export const ExcludeCache = () =>
  SetMetadata(EXCLUDE_CACHE_KEY, true);
