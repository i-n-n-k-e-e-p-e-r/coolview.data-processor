import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type DeviceDataDocument = HydratedDocument<DeviceData>;

export enum OutputValueType {
  Double = 'Double',
  Boolean = 'Boolean',
  String = 'String',
  Enum = 'Enum',
  Gps = 'Gps',
  Json = 'Json', // JSON type for extensibility
  DeviceStatus = 'DeviceStatus', // For device-level messages
}

// Converter from index to OutputValueType enum value
export function outputValueTypeFromIndex(
  index: number,
): OutputValueType | undefined {
  const values = Object.values(OutputValueType);
  return values[index] as OutputValueType | undefined;
}

export enum MessageLevel {
  Information = 'Information',
  Warning = 'Warning',
  Error = 'Error',
}

export enum DeviceStatus {
  Online = 'Online',
  Offline = 'Offline',
  Maintenance = 'Maintenance',
  Error = 'Error',
  Unknown = 'Unknown',
}

@Schema()
export class DeviceStatusValue {
  @Prop({ required: true, default: DeviceStatus.Online })
  status: DeviceStatus;

  @Prop({ type: MongooseSchema.Types.Mixed })
  jsonValue?: any;
}
const DeviceStatusValueSchema = SchemaFactory.createForClass(DeviceStatusValue);

@Schema()
export class GeoPoint {
  @Prop({ required: true, default: 0.0 })
  latitude: number;

  @Prop({ required: true, default: 0.0 })
  longitude: number;
}

export function geoStrToPoint(geoStr: string): GeoPoint {
  const [latitude, longitude] = geoStr.split(',').map(Number);
  return { latitude, longitude };
}

const GeoPointSchema = SchemaFactory.createForClass(GeoPoint);

@Schema()
export class UserStatusInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    enum: MessageLevel,
    default: MessageLevel.Information,
  })
  level: MessageLevel;

  @Prop({ default: false })
  notified: boolean;

  @Prop({ default: '' })
  notificationMessage: string;

  @Prop({ type: Date })
  notifiedAt?: Date;
}

const UserStatusInfoSchema = SchemaFactory.createForClass(UserStatusInfo);

@Schema({ timestamps: true })
export class DeviceData {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: false })
  sensorId?: string;

  @Prop({ required: true, type: Date })
  dateTime: Date;

  @Prop({
    required: true,
    enum: OutputValueType,
    default: OutputValueType.Double,
  })
  outputValueType: OutputValueType;

  // Standard value types
  @Prop({ default: 0.0 })
  doubleValue?: number;

  @Prop({ default: false })
  booleanValue?: boolean;

  @Prop({ default: 0 })
  enumValue?: number;

  @Prop({ default: '' })
  stringValue?: string;

  @Prop({ type: GeoPointSchema, default: () => ({}) })
  point?: GeoPoint;

  // Device status value
  @Prop({
    type: DeviceStatusValueSchema,
    default: () => ({ status: DeviceStatus.Online, value: {} }),
  })
  deviceStatus?: DeviceStatusValue;

  // JSON value for extensible data
  @Prop({ type: MongooseSchema.Types.Mixed })
  jsonValue?: any;

  // Error information
  @Prop({ default: '' })
  errorMessage?: string;

  // Per-user status tracking
  @Prop({ type: [UserStatusInfoSchema], default: [] })
  userStatuses: UserStatusInfo[];
}

export const DeviceDataSchema = SchemaFactory.createForClass(DeviceData);

// Add compound indexes for efficient querying
DeviceDataSchema.index({ deviceId: 1, dateTime: -1 });
DeviceDataSchema.index({ deviceId: 1, sensorId: 1, dateTime: -1 });
DeviceDataSchema.index({ 'userStatuses.userId': 1, 'userStatuses.status': 1 });
// Add index for device status queries
DeviceDataSchema.index({ 'deviceStatus.status': 1, deviceId: 1, dateTime: -1 });
DeviceDataSchema.index({ 'deviceStatus.status': 1 });
// Add indexes for unnotified messages queries
DeviceDataSchema.index({
  'userStatuses.userId': 1,
  'userStatuses.notified': 1,
});
DeviceDataSchema.index({ deviceId: 1, 'userStatuses.notified': 1 });
