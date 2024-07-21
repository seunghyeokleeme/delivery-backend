import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { headers } = req;

    if ('x-jwt' in headers) {
      const token = headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('sub')) {
        try {
          const user = await this.usersService.findById(decoded['sub']);
          console.log(user);
          req['user'] = user;
        } catch (e) {}
      }
    }
    next();
  }
}
