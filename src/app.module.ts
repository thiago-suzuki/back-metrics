import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChargeModule } from './app/charge/charge.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    ChargeModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}