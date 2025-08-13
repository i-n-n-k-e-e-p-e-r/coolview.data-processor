import { Controller, Get } from '@nestjs/common';
import { type ApplicationStatus } from './interfaces/application.status';
import { ApplicationHealthService } from './application.health.service';
import { API_BASE_PATH } from '../../const';

export const APPLICATION_HEALTH_BASE_PATH = `${API_BASE_PATH}/application-status`;

@Controller()
export class ApplicationHealthController {
  constructor(
    private readonly applicationHealthService: ApplicationHealthService,
  ) {}

  @Get(APPLICATION_HEALTH_BASE_PATH)
  getStatus(): ApplicationStatus {
    return this.applicationHealthService.getStatus();
  }
}
