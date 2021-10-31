import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['secret'] !== process.env.SECRET)
      throw new ForbiddenException('Secret is not valid');

    next();
  }
}
