import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Status } from './enums/status';
import { MqttStatus } from '@nestjs/microservices';
import { ApplicationStatus } from './interfaces/application.status';

@Injectable()
export class ApplicationHealthService {
  private mqttBrokerStatus: Status = Status.OFFLINE;

  constructor(
    @InjectConnection('device.data')
    private readonly mongoConnection: Connection,
  ) {}

  async getStatus(): Promise<ApplicationStatus> {
    const mongoStatus = await this.testMongoConnection();
    return {
      status:
        mongoStatus && this.mqttBrokerStatus === Status.ONLINE
          ? Status.ONLINE
          : Status.OFFLINE,
      mongoDBStatus: mongoStatus ? Status.ONLINE : Status.OFFLINE,
      mqttBrokerStatus: this.mqttBrokerStatus,
    };
  }

  updateMqttBrokerStatus(status: MqttStatus): void {
    this.mqttBrokerStatus =
      status.toString() === 'connected' ? Status.ONLINE : Status.OFFLINE;
  }

  // Manual connection test method
  async testMongoConnection(): Promise<boolean> {
    try {
      const result = await this.mongoConnection?.db?.admin().ping();
      if (result?.ok !== 1) {
        throw new Error('MongoDB ping failed');
      }
      return true;
    } catch (error) {
      console.error('MongoDB ping failed:', error);
      return false;
    }
  }
}
