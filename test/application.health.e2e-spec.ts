import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { APPLICATION_HEALTH_BASE_PATH } from '../src/application.health/application.health.controller';

describe('ApplicationHealthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`${APPLICATION_HEALTH_BASE_PATH} (GET)`, () => {
    return request(app.getHttpServer())
      .get(APPLICATION_HEALTH_BASE_PATH)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(typeof res.body).toBe('object');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.status).toBe('ONLINE');
        expect(res.body).toHaveProperty('mongoDBStatus');
        expect(res.body).toHaveProperty('mqttBrokerStatus');
      });
  });
});
