import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';
import { DeviceDataService } from './device.data.service';
import { MqttDeviceDataDto } from './dto/mqtt.device.data.dto';
import {
  DeviceData,
  OutputValueType,
  DeviceStatusValue,
  outputValueTypeFromIndex,
  geoStrToPoint,
} from './schemas/device.data.schema';

@Controller()
export class DeviceDataController {
  constructor(private readonly deviceDataService: DeviceDataService) {}

  /**
   * Handle sensor data from devices using shared subscription pattern
   * @param data The payload data from the MQTT message
   * @param context The MQTT message context
   */
  @MessagePattern('$share/data-processor/devices/+/sensors/+')
  async handleSensorData(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    console.log(`Processing message from ${topic}:`, data);

    // Extract device and sensor IDs from the topic
    const topicParts = topic.split('/');
    const deviceId = topicParts[1]; // devices/{deviceId}/sensors/{sensorId}
    const sensorId = topicParts[3];

    console.log(
      `Device ID: ${deviceId}, Sensor ID: ${sensorId}, Data: ${JSON.stringify(data, null, 2)}`,
    );

    // Process the data (e.g., store in database, trigger alerts, etc.)
    if (!data || typeof data !== 'object') {
      console.error('Invalid data received:', data);
      return { success: false, message: 'Invalid data format' };
    }

    // Convert the incoming data to the expected DTO format
    try {
      const savingResult = await this.processDeviceData(
        deviceId,
        sensorId,
        JSON.parse(JSON.stringify(data)) as MqttDeviceDataDto,
      );
      return { success: savingResult, message: savingResult.error };
    } catch (error) {
      console.error('Error while saving data:', error);
      return { success: false, message: 'Error while saving data' };
    }
  }

  private async processDeviceData(
    deviceId: string,
    sensorId: string,
    data: MqttDeviceDataDto,
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log(`Processing data from device ${deviceId}, sensor ${sensorId}`);
    try {
      // TODO: additional processing logic
      const valueType = outputValueTypeFromIndex(data.OutputValueType);
      if (!valueType) {
        throw new Error(`Invalid output value type: ${data.OutputValueType}`);
      }

      const deviceData: DeviceData = {
        deviceId,
        sensorId,
        dateTime: new Date(Number(data.Time) * 1000), // Convert from seconds to milliseconds
        outputValueType: valueType,
        userStatuses: [],
      };

      switch (valueType) {
        case OutputValueType.Double:
          deviceData.doubleValue = parseFloat(data.Value);
          break;
        case OutputValueType.Boolean:
          deviceData.booleanValue = data.Value === 'true';
          break;
        case OutputValueType.String:
          deviceData.stringValue = data.Value;
          break;
        case OutputValueType.Enum:
          deviceData.enumValue = parseInt(data.Value, 10);
          break;
        case OutputValueType.Gps: {
          deviceData.point = geoStrToPoint(data.Value);
          break;
        }
        case OutputValueType.Json:
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            deviceData.jsonValue = JSON.parse(data.Value);
          } catch (error) {
            console.error('Invalid JSON value:', data.Value, error);
            return {
              success: false,
              error: 'Invalid JSON value format',
            };
          }
          break;
        case OutputValueType.DeviceStatus:
          try {
            deviceData.deviceStatus = JSON.parse(
              data.Value,
            ) as DeviceStatusValue;
          } catch (error) {
            console.error('Invalid DeviceStatus value:', data.Value, error);
            return {
              success: false,
              error: 'Invalid DeviceStatus value format',
            };
          }
          break;
        default:
          throw new Error(
            `Unsupported output value type. Device ID: ${deviceId}, Sensor ID: ${sensorId}`,
          );
      }

      await this.deviceDataService.append(deviceData);
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error saving device data to MongoDB:', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
    return { success: true };
  }
}
