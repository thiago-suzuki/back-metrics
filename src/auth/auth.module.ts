import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      privateKey: process.env.ACCESS_TOKEN_SECRET,
    }),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AuthModule {}
