import { Sizes } from "../types/sizes";
import { Colors } from "../types/colors";
import * as Spacing from "./sizes";
import * as Typography from "./typography";
import * as TypographyTypes from "../types/typography";
import { lightColors } from "./colors";

export interface DiscoveryTheme {
  name: string;
  colors: Colors;
  sizes: Sizes;
  fontFamilies: TypographyTypes.FontFamilies;
  fontSizes: TypographyTypes.TextSizes;
}

export const lightTheme: DiscoveryTheme = {
  name: "light",
  colors: lightColors,
  sizes: Spacing.sizes,
  fontFamilies: Typography.fontFamilies,
  fontSizes: Typography.fontSizes,
};

export * from "./colors";
export * from "./sizes";
export * from "./typography";
export * from "./mixins";
export * from "./typography";
export * from "../types/typography";
export * from "../types/colors";
export * from "../types/sizes";
