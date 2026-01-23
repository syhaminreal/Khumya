import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../../../constants/theme';

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...sizeStyles[size],
    };

    if (fullWidth) {
      baseStyle.width = "100%";
    }

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.gray300 : Colors.primary,
          ...Shadows.sm,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.gray300 : Colors.secondary,
          ...Shadows.sm,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: disabled ? Colors.gray300 : Colors.primary,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.gray300 : Colors.error,
          ...Shadows.sm,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };

    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        return {
          ...baseTextStyle,
          color: disabled ? Colors.gray500 : Colors.white,
        };
      case "outline":
      case "ghost":
        return {
          ...baseTextStyle,
          color: disabled ? Colors.gray400 : Colors.primary,
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost"
              ? Colors.primary
              : Colors.white
          }
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text
            style={[
              getTextStyle(),
              textStyle,
              icon ? { marginLeft: iconPosition === "left" ? 0 : Spacing.sm } : null,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.base,
    gap: Spacing.sm,
  },
  text: {
    fontWeight: Typography.fontWeight.semiBold,
    textAlign: "center",
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 36,
  },
  md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 44,
  },
  lg: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    minHeight: 52,
  },
};

const textSizeStyles: Record<ButtonSize, TextStyle> = {
  sm: {
    fontSize: Typography.fontSize.sm,
  },
  md: {
    fontSize: Typography.fontSize.base,
  },
  lg: {
    fontSize: Typography.fontSize.lg,
  },
};

export default Button;
