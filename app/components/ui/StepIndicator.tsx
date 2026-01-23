import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '../../../constants/theme';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <View key={index} style={styles.stepWrapper}>
            <View style={styles.stepContent}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.circleActive,
                  isCompleted && styles.circleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      (isActive || isCompleted) && styles.stepNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  isCompleted && styles.stepLabelCompleted,
                ]}
                numberOfLines={1}
              >
                {step}
              </Text>
            </View>

            {!isLast && (
              <View
                style={[
                  styles.connector,
                  isCompleted && styles.connectorCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  stepWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepContent: {
    alignItems: "center",
    width: 60,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  circleActive: {
    backgroundColor: Colors.primary,
  },
  circleCompleted: {
    backgroundColor: Colors.success,
  },
  stepNumber: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray500,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  checkmark: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  stepLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray500,
    textAlign: "center",
  },
  stepLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  stepLabelCompleted: {
    color: Colors.success,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.gray200,
    marginTop: 15,
    marginHorizontal: -10,
  },
  connectorCompleted: {
    backgroundColor: Colors.success,
  },
});

export default StepIndicator;
