import { Injectable } from '@nestjs/common';
import { Status } from './enums/status';
import { ApplicationStatus } from './interfaces/application.status';
import { MqttStatus } from '@nestjs/microservices';

@Injectable()
export class ApplicationHealthService {
  private applicationStatus: ApplicationStatus = {
    status: Status.OFFLINE,
    mongoDBStatus: Status.OFFLINE,
    mqttBrokerStatus: Status.OFFLINE,
  };

  getStatus(): ApplicationStatus {
    this.applicationStatus.status = this.isOnline()
      ? Status.ONLINE
      : Status.OFFLINE;
    return this.applicationStatus;
  }

  updateStatus(newStatus: ApplicationStatus): void {
    this.applicationStatus = newStatus;
  }

  updateMongoDBStatus(status: Status): void {
    this.applicationStatus.mongoDBStatus = status;
  }

  updateMqttBrokerStatus(status: MqttStatus): void {
    this.applicationStatus.mongoDBStatus =
      status.toString() === 'connected' ? Status.ONLINE : Status.OFFLINE;
  }

  isOnline(): boolean {
    return (
      this.applicationStatus.status === Status.ONLINE &&
      this.applicationStatus.mongoDBStatus === Status.ONLINE &&
      this.applicationStatus.mqttBrokerStatus === Status.ONLINE
    );
  }
}
