import { Module } from '@nestjs/common';
import { ApplicationHealthModule } from './application.health/application.health.module';
import { ConfigModule } from '@nestjs/config';
import { DeviceDataModule } from './device.data/device.data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApplicationHealthModule,
    DeviceDataModule,
  ],
})
export class AppModule {}
