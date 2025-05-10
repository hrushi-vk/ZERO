import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';
import { Transaction } from '@/types';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface RecentTransactionsListProps {
  transactions: Transaction[];
  currency: string;
  isDarkMode: boolean;
}

export default function RecentTransactionsList({ 
  transactions, 
  currency,
  isDarkMode
}: RecentTransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: isDarkMode ? theme.colors.dark.subtext : theme.colors.light.subtext }]}>
          No transactions yet. Add your first transaction!
        </Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.transactionItem}>
          <View style={[
            styles.iconContainer, 
            { 
              backgroundColor: isDarkMode 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(0,0,0,0.05)'
            }
          ]}>
            {getCategoryIcon(item.category, item.type)}
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={[
              styles.categoryText, 
              { color: isDarkMode ? theme.colors.dark.text : theme.colors.light.text }
            ]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
            <Text style={[
              styles.dateText, 
              { color: isDarkMode ? theme.colors.dark.subtext : theme.colors.light.subtext }
            ]}>
              {format.date(item.date)}
            </Text>
          </View>
          
          <Text style={[
            styles.amountText, 
            { 
              color: item.type === 'income' 
                ? theme.colors.success 
                : theme.colors.error
            }
          ]}>
            {item.type === 'income' ? '+' : '-'} {format.currency(item.amount, currency)}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  detailsContainer: {
    flex: 1,
  },
  categoryText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
    marginBottom: 2,
  },
  dateText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
  },
  amountText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
  },
});