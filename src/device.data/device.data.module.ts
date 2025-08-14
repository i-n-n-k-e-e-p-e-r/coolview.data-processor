import { Module } from '@nestjs/common';
import { DeviceDataController } from './device.data.controller';
import { DeviceDataService } from './device.data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceData, DeviceDataSchema } from './schemas/device.data.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: DeviceData.name,
          schema: DeviceDataSchema,
          collection: 'device.data',
        },
      ],
      'device.data',
    ),
  ],
  controllers: [DeviceDataController],
  providers: [DeviceDataService],
})
export class DeviceDataModule {}
