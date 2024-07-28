import { Dimensions } from "react-native";
import DeviceInfo from "react-native-device-info";

//Default guideline sizes are based on standard ~5" screen mobile device
const GUIDELINE_BASE_WIDTH = 350;
const GUIDELINE_BASE_HEIGHT = 680;
export const fullWidth = Dimensions.get("window").width;
export const fullHeight = Dimensions.get("window").height;

export const scale = (size: number): number =>
  (fullWidth / GUIDELINE_BASE_WIDTH) * size;
export const verticalScale = (size: number): number =>
  (fullHeight / GUIDELINE_BASE_HEIGHT) * size;
export const moderateScale = (size: number, factor = 0.4): number =>
  size + (scale(size) - size) * factor;

export const percentage = <T extends boolean>(
  value: number,
  absoluteValue: boolean = false,
): T extends true ? number : string => {
  const w = Dimensions.get("window").width;
  // Need (as any) because of this: https://github.com/microsoft/TypeScript/issues/24929
  return (absoluteValue
    ? (value * w) / 100
    : value + "%") as unknown as T extends true ? number : string;
};

export type DeviceType = "Handset" | "Tablet" | "Tv" | "unknown";

export const selectDeviceType = <T>(
  spec: { [type in DeviceType]?: T },
  defaultValue: T,
): T => {
  const deviceType = DeviceInfo.getDeviceType() as DeviceType;
  const definedValue = spec[deviceType];
  return definedValue !== undefined ? definedValue : defaultValue;
};
