import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../../constants/theme";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
  noPadding?: boolean;
  variant?: "default" | "outlined" | "elevated";
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  style,
  noPadding = false,
  variant = "default",
  className,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.card,
      padding: noPadding ? 0 : Spacing.base,
    };

    switch (variant) {
      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: Colors.border,
        };
      case "elevated":
        return {
          ...baseStyle,
          ...Shadows.lg,
        };
      default:
        return {
          ...baseStyle,
          ...Shadows.base,
        };
    }
  };

  const appliedClassName = className ?? "bg-white";

  return (
    <View style={[getCardStyle(), style]} className={appliedClassName}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});

export default Card;
