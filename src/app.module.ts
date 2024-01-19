import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChargeModule } from './app/charge/charge.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    ChargeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}