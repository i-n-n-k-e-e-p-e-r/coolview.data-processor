// Example JSON: {"Time":1755183259,"OutputValueType":1,"Value":"1"}
export interface MqttDeviceDataDto {
  Time: bigint;
  OutputValueType: number;
  Value: string;
}
