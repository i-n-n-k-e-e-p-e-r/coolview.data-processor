import { Module } from '@nestjs/common';
import { ApplicationHealthModule } from './application.health/application.health.module';
import { ConfigModule } from '@nestjs/config';
import { DeviceDataModule } from './device.data/device.data.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      connectionName: 'device.data',
      useFactory: () => ({
        uri: process.env.MONGO_DB_URI ?? 'mongodb://localhost:27017/coolview',
        heartbeatFrequencyMS: 15000, // Check connection every 10 seconds
        onConnectionCreate: (connection: Connection) => {
          console.log('MongoDB connection created');
          return connection;
        },
        autoIndex: true,
        autoCreate: true,
      }),
    }),
    ApplicationHealthModule,
    DeviceDataModule,
  ],
})
export class AppModule {}
