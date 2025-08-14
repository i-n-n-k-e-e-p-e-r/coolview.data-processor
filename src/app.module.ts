import { Module } from '@nestjs/common';
import { ApplicationHealthModule } from './application.health/application.health.module';
import { ConfigModule } from '@nestjs/config';
import { DeviceDataModule } from './device.data/device.data.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_DB_URI ?? 'mongodb://localhost:27017/coolview',
      {
        connectionName: 'device.data',
        onConnectionCreate: (connection) => {
          console.log('Database connection established:', connection.name);
        },
        connectionErrorFactory: (error) => {
          console.error('Database connection error:', error);
          return error;
        },
        autoIndex: true,
        autoCreate: true,
      },
    ),
    ApplicationHealthModule,
    DeviceDataModule,
  ],
})
export class AppModule {}
