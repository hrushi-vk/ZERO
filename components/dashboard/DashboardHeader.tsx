import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';

interface DashboardHeaderProps {
  name: string;
  balance: number;
  currency: string;
}

export default function DashboardHeader({ name, balance, currency }: DashboardHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.statusBarSpace} />
      <View style={styles.headerContent}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>{name}</Text>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>
            {format.currency(balance, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.light.background,
  },
  statusBarSpace: {
    height: Platform.OS === 'ios' ? 50 : 40,
  },
  headerContent: {
    paddingHorizontal: theme.spacing.xl,
  },
  greeting: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.xl,
    color: theme.colors.light.text,
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxxl,
    color: theme.colors.light.text,
    marginBottom: theme.spacing.lg,
  },
  balanceContainer: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.roundness.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.light.sm,
  },
  balanceLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
    color: theme.colors.light.text,
  },
});