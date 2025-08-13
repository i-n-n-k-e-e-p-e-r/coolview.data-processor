import { Module } from '@nestjs/common';
import { ApplicationHealthController } from './application.health.controller';
import { ApplicationHealthService } from './application.health.service';

@Module({
  controllers: [ApplicationHealthController],
  providers: [ApplicationHealthService],
})
export class ApplicationHealthModule {}
