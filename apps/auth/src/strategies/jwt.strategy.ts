import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // Configure the JWT strategy
    super({
      // Tell the strategy where the JWT is located, set as a cookie by the auth service
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication,
      ]),
      // Key used to decode the JWT, same one used to sign it
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // Find the user in the database based off of the userId
  // Token payload from decoded JWT is provided as validate() payload
  // Return value gets populated on the request object as request.user
  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ _id: userId });
  }
}
