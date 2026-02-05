/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  Platform,
  TextStyle,
} from "react-native";

import Colors from "@/constants/Colors";
import { useTheme } from "@/utils/ThemeContext";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

// Font weight mapping for consistent cross-platform font rendering
type FontWeight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

const getFontFamily = (weight?: FontWeight): string => {
  // Map fontWeight to specific Poppins font family
  // This ensures consistent rendering across Android and iOS
  // Note: Using SemiBold for bold weights for a cleaner, modern look
  switch (weight) {
    case "500":
      return "Poppins-Medium";
    case "600":
    case "700":
    case "bold":
    case "800":
    case "900":
      return "Poppins-SemiBold";
    case "100":
    case "200":
    case "300":
    case "400":
    case "normal":
    default:
      return "Poppins-Regular";
  }
};

export type TextProps = ThemeProps &
  DefaultText["props"] & {
    fontWeight?: FontWeight;
  };
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const { colorScheme } = useTheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[colorScheme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, fontWeight, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  // Extract fontWeight and fontSize from style if present
  const styleArray = Array.isArray(style) ? style : [style];
  let extractedWeight: FontWeight | undefined = fontWeight;
  let extractedFontSize: number | undefined;

  // Check styles for fontWeight and fontSize
  styleArray.forEach((s) => {
    if (s && typeof s === "object") {
      if ("fontWeight" in s) {
        extractedWeight = (s as TextStyle).fontWeight as FontWeight;
      }
      if ("fontSize" in s) {
        extractedFontSize = (s as TextStyle).fontSize as number;
      }
    }
  });

  const fontFamily = getFontFamily(extractedWeight);

  // Scale font size slightly smaller on Android (0.95x) to match iOS rendering
  const androidFontScale = 0.95;
  const scaledFontSize =
    extractedFontSize && Platform.OS === "android"
      ? extractedFontSize * androidFontScale
      : extractedFontSize;

  return (
    <DefaultText
      style={[
        {
          color,
          fontFamily,
          // On Android, we need to remove fontWeight when using custom fonts
          // as it can cause inconsistent rendering
          ...(Platform.OS === "android"
            ? { fontWeight: "normal" as FontWeight }
            : {}),
        },
        style,
        // Override fontWeight on Android to prevent double-weighting
        // Also apply scaled font size on Android
        Platform.OS === "android"
          ? {
              fontWeight: "normal" as FontWeight,
              ...(scaledFontSize ? { fontSize: scaledFontSize } : {}),
            }
          : {},
      ]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const backgroundColor =
    lightColor || darkColor
      ? useThemeColor({ light: lightColor, dark: darkColor }, "background")
      : "transparent";

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
