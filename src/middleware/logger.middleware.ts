import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`Request... ${req.method} ${req.originalUrl}`);
        console.log(`Body... ${JSON.stringify(req.body)}`);
        next();
    }
}