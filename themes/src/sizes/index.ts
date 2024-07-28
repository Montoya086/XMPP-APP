import { Sizes } from "../../types/sizes";
import { moderateScale, scale, selectDeviceType } from "../mixins";

export const sizes: Sizes = {
  xxxs: selectDeviceType(
    { Handset: scale(4), Tablet: moderateScale(4), Tv: moderateScale(4) },
    4,
  ),
  xxs: selectDeviceType(
    { Handset: scale(8), Tablet: moderateScale(8), Tv: moderateScale(8) },
    8,
  ),
  xs: selectDeviceType(
    { Handset: scale(12), Tablet: moderateScale(12), Tv: moderateScale(12) },
    12,
  ),
  sm: selectDeviceType(
    { Handset: scale(16), Tablet: moderateScale(16), Tv: moderateScale(16) },
    16,
  ),
  md: selectDeviceType(
    { Handset: scale(24), Tablet: moderateScale(24), Tv: moderateScale(24) },
    24,
  ),
  lg: selectDeviceType(
    { Handset: scale(32), Tablet: moderateScale(32), Tv: moderateScale(32) },
    32,
  ),
  xl: selectDeviceType(
    { Handset: scale(40), Tablet: moderateScale(40), Tv: moderateScale(40) },
    40,
  ),
  xxl: selectDeviceType(
    { Handset: scale(60), Tablet: moderateScale(60), Tv: moderateScale(60) },
    60,
  ),
  xxxl: selectDeviceType(
    { Handset: scale(100), Tablet: moderateScale(100), Tv: moderateScale(100) },
    100,
  ),
};
