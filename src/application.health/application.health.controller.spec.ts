import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationHealthController } from './application.health.controller';
import { ApplicationHealthService } from './application.health.service';
import { Status } from './enums/status';
import { APPLICATION_HEALTH_BASE_PATH } from './application.health.controller';

describe('ApplicationHealthController', () => {
  let applicationHealthController: ApplicationHealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationHealthController],
      providers: [ApplicationHealthService],
    }).compile();

    applicationHealthController = app.get<ApplicationHealthController>(
      ApplicationHealthController,
    );
  });

  describe(APPLICATION_HEALTH_BASE_PATH, () => {
    it('should return ApplicationStatus type with main status of type enum Status = "ONLINE"', () => {
      const appStatus = applicationHealthController.getStatus();
      expect(typeof appStatus).toBe('object');
      expect(appStatus).toHaveProperty('status');
      expect(appStatus).toHaveProperty('mongoDBStatus');
      expect(appStatus).toHaveProperty('mqttBrokerStatus');
      expect(appStatus.status).toBe(Status.ONLINE);
    });
  });
});
