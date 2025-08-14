import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';

@Controller()
export class DeviceDataController {
  constructor() {
    console.log(
      'DeviceDataController initialized, ready to receive MQTT messages',
    );
  }

  /**
   * Handle sensor data from devices using shared subscription pattern
   * @param data The payload data from the MQTT message
   * @param context The MQTT message context
   */
  @MessagePattern('$share/data-processor/devices/+/sensors/+')
  handleSensorData(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    console.log(`Processing message from ${topic}:`, data);

    // Extract device and sensor IDs from the topic
    const topicParts = topic.split('/');
    const deviceId = topicParts[1]; // devices/{deviceId}/sensors/{sensorId}
    const sensorId = topicParts[3];

    // Process the data (e.g., store in database, trigger alerts, etc.)
    this.processDeviceData(deviceId, sensorId, data);

    return { success: true };
  }

  private processDeviceData(
    deviceId: string,
    sensorId: string,
    data: any,
  ): void {
    // Implement your business logic here
    // Examples:
    // 1. Store data in a database
    // 2. Analyze for anomalies
    // 3. Forward to other services
    // 4. Trigger alerts based on thresholds

    console.log(`Processing data from device ${deviceId}, sensor ${sensorId}`);
    console.log(`Data:`, JSON.stringify(data, null, 2));
    // TODO: Implement your business logic
  }
}
