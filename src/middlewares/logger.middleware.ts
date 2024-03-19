import {
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import {
  Request,
  Response,
  NextFunction,
} from 'express';

@Injectable()
export class LoggerMiddleware
  implements NestMiddleware
{
  private logger = new Logger('HTTP');
  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = req.get(
        'content-length',
      );

      const diff = process.hrtime(startAt);
      const responseTime = (
        diff[0] * 1e3 +
        diff[1] * 1e-6
      ).toFixed(2); // convert to milliseconds

      this.logger.log(
        ` ${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength} - ${userAgent} ${ip} " `,
      );
    });

    // Ends middleware function execution, hence allowing to move on
    if (next) {
      next();
    }
  }
}
