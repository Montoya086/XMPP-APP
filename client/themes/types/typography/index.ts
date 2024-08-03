import { Colors } from "../colors";

export type FontFamilies = {
  light: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
  normal: string;
};

export type TextFontWeight =
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "normal"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export type TextSizeConfig = {
  color: keyof Colors;
  fontSize: number;
  fontWeight: TextFontWeight;
  fontFamily: keyof FontFamilies;
  lineHeight?: number;
  letterSpacing: number;
};

export type TextSizes = {
  H0A: TextSizeConfig;
  H0B: TextSizeConfig;
  H1A: TextSizeConfig;
  H1B: TextSizeConfig;
  H2: TextSizeConfig;
  H3: TextSizeConfig;
  H4: TextSizeConfig;
  H5: TextSizeConfig;
  headline_a: TextSizeConfig;
  paragraph_a: TextSizeConfig;
  headline_b: TextSizeConfig;
  paragraph_b: TextSizeConfig;
  caption: TextSizeConfig;
  small: TextSizeConfig;
  cta_small: TextSizeConfig;
  cta_medium: TextSizeConfig;
  cta_large: TextSizeConfig;
};
