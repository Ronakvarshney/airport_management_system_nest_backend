import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadInterface } from '../interface/payload.interface';

//jwtstratgies just help to get the token from url and validate it automatically by yourslef and add req.user mai data user kaa

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'access-token',
    });
  }

  validate(payload: PayloadInterface) {
    return payload;
  }
}
