import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChargeModule } from './app/charge/charge.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true, envFilePath: '.env' }),
    ChargeModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}