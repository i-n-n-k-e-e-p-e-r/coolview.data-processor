import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceData } from './schemas/device.data.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceDataService {
  constructor(
    @InjectModel(DeviceData.name, 'device.data')
    private readonly deviceDataModel: Model<DeviceData>,
  ) {}

  async append(data: DeviceData): Promise<DeviceData> {
    const deviceData = new this.deviceDataModel(data);
    return await deviceData.save();
  }

  async findByDeviceId(deviceId: string, limit = 10): Promise<DeviceData[]> {
    return this.deviceDataModel
      .find({ deviceId })
      .sort({ dateTime: -1 })
      .limit(limit)
      .exec();
  }
}
