import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';

async function bootstrap() {
  // Start HTTP server
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  await app.listen(process.env.APPLICATION_PORT ?? 3000, '0.0.0.0');

  // Start TCP microservice
  const microservice =
    await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, {
      useFactory: (configService: ConfigService) => ({
        transport: Transport.MQTT,
        options: {
          url: `mqtts://${configService.get<string>('MQTT_BROKER_ADDRESS') || 'localhost'}:${configService.get<number>('MQTT_BROKER_PORT') || 18883}`,
          username:
            configService.get<string>('MQTT_BROKER_USERNAME') || 'mosquitto',
          password:
            configService.get<string>('MQTT_BROKER_PASSWORD') || 'mosquitto',
          clientId:
            configService.get<string>('MQTT_CLIENT_ID') ||
            'coolview-data-processor',
          subscribeOptions: {
            qos: 2,
          },
          protocolVersion: 5,
          reconnectPeriod: 1000,
          clean: true,
          cert: fs.readFileSync(
            `${process.cwd()}/certificates/mqtt.client.crt`,
          ),
          key: fs.readFileSync(`${process.cwd()}/certificates/mqtt.client.key`),
          ca: fs.readFileSync(
            `${process.cwd()}/certificates/mqtt.client.root.crt`,
          ),
          rejectUnauthorized: false, // FIXME: should remove in prod (certificates' hostname check)
        },
      }),
      inject: [ConfigService],
    });
  await microservice.listen();
}
void bootstrap();
