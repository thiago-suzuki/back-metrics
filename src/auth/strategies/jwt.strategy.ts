import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadTokenDTO } from 'src/auth/dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: PayloadTokenDTO) {
    // const currentTimestamp = Date.now() / 1000;

    // if (payload.exp < currentTimestamp) {
    //   throw new UnauthorizedException('TokenExpiredError');
    // }

    return { userId: payload.id };
  }
}
