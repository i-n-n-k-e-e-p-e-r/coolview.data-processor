import { Injectable } from '@nestjs/common';
import { Status } from './enums/status';
import { ApplicationStatus } from './interfaces/application.status';

@Injectable()
export class ApplicationHealthService {
  getStatus(): ApplicationStatus {
    // TODO: Implement actual health checks for MongoDB and MQTT Broker
    return {
      status: Status.ONLINE,
      mongoDBStatus: Status.OFFLINE,
      mqttBrokerStatus: Status.OFFLINE,
    };
  }
}
