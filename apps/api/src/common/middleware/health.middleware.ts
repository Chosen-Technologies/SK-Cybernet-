import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HealthMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    next();
  }
}
