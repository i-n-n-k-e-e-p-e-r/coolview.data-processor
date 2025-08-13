import { Status } from '../enums/status';

export interface ApplicationStatus {
  status: Status;
  mongoDBStatus: Status;
  mqttBrokerStatus: Status;
}
