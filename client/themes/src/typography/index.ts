import * as TypographyTypes from "../../types/typography";
import { moderateScale, scale, selectDeviceType } from "../mixins";

const fontFamilies: TypographyTypes.FontFamilies = {
  light: "Inter-Light",
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  semibold: "Inter-SemiBold",
  bold: "Inter-Bold",
  normal: "MouseMemoirs-Regular",
};

const fontSizes: TypographyTypes.TextSizes = {
  H0A: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(52), Tv: moderateScale(52) },
      scale(52),
    ),
    fontWeight: selectDeviceType({ Handset: "regular", Tv: "bold" }, "regular"),
    fontFamily: selectDeviceType({ Handset: "regular", Tv: "bold" }, "regular"),
    lineHeight: undefined,
    letterSpacing: 0,
  },
  H0B: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(40), Tv: moderateScale(40) },
      scale(40),
    ),
    fontWeight: selectDeviceType({ Handset: "regular", Tv: "bold" }, "regular"),
    fontFamily: selectDeviceType({ Handset: "regular", Tv: "bold" }, "regular"),
    lineHeight: undefined,
    letterSpacing: 0,
  },
  H1A: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(36), Tv: moderateScale(36) },
      scale(36),
    ),
    fontWeight: selectDeviceType({ Handset: "regular", Tv: "bold" }, "regular"),
    fontFamily: selectDeviceType({ Handset: "regular", Tv: "bold" }, "regular"),
    lineHeight: undefined,
    letterSpacing: 0,
  },
  H1B: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(34), Tv: moderateScale(34) },
      scale(34),
    ),
    fontWeight: selectDeviceType({ Handset: "regular", Tv: "bold" }, "regular"),
    fontFamily: selectDeviceType({ Handset: "regular", Tv: "bold" }, "regular"),
    lineHeight: undefined,
    letterSpacing: 0,
  },
  H2: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(28), Tablet: moderateScale(28) },
      scale(28),
    ),
    fontWeight: selectDeviceType(
      { Handset: "regular", Tablet: "bold" },
      "regular",
    ),
    fontFamily: selectDeviceType(
      { Handset: "regular", Tablet: "bold" },
      "regular",
    ),
    lineHeight: undefined,
    letterSpacing: 0,
  },
  H3: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(22), Tv: moderateScale(22) },
      scale(22),
    ),
    fontWeight: "semibold",
    fontFamily: "semibold",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  H4: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(20), Tv: moderateScale(20) },
      scale(20),
    ),
    fontWeight: "semibold",
    fontFamily: "semibold",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  H5: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(16), Tv: moderateScale(16) },
      scale(16),
    ),
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  headline_a: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(18), Tv: moderateScale(18) },
      scale(18),
    ),
    fontWeight: "bold",
    fontFamily: "bold",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  paragraph_a: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(18), Tv: moderateScale(18) },
      scale(18),
    ),
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  headline_b: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(16), Tv: moderateScale(16) },
      scale(16),
    ),
    fontWeight: "bold",
    fontFamily: "bold",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  paragraph_b: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(14), Tv: moderateScale(16) },
      scale(14),
    ),
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  caption: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(14), Tv: moderateScale(14) },
      scale(14),
    ),
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  small: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(10), Tv: moderateScale(10) },
      scale(10),
    ),
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  cta_small: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(11), Tv: moderateScale(11) },
      scale(11),
    ),
    fontWeight: "semibold",
    fontFamily: "semibold",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  cta_medium: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(14), Tv: moderateScale(14) },
      scale(14),
    ),
    fontWeight: "medium",
    fontFamily: "medium",
    lineHeight: undefined,
    letterSpacing: 0,
  },
  cta_large: {
    color: "foreground0",
    fontSize: selectDeviceType(
      { Handset: scale(16), Tv: moderateScale(16) },
      scale(16),
    ),
    fontWeight: "medium",
    fontFamily: "medium",
    lineHeight: undefined,
    letterSpacing: 0,
  },
};

export { fontFamilies, fontSizes };
