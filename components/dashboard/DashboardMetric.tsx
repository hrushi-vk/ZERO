import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';

interface DashboardMetricProps {
  title: string;
  value: number;
  currency: string;
  icon: React.ReactNode;
  style?: ViewStyle;
}

export default function DashboardMetric({ title, value, currency, icon, style }: DashboardMetricProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{format.currency(value, currency)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.light.sm,
  },
  iconContainer: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.light.subtext,
    marginBottom: 2,
  },
  value: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.light.text,
  },
});