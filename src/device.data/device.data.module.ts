import { Module } from '@nestjs/common';
import { DeviceDataController } from './device.data.controller';

@Module({
  controllers: [DeviceDataController],
})
export class DeviceDataModule {}
