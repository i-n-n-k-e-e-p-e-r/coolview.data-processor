import { Module } from '@nestjs/common';
import { ApplicationHealthModule } from './application.health/application.health.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApplicationHealthModule,
  ],
})
export class AppModule {}
