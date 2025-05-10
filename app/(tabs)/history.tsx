import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Transaction } from '@/types';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { FilterX, CreditCard, Calendar } from 'lucide-react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

type Filter = {
  type?: 'income' | 'expense';
  date?: 'today' | 'week' | 'month' | 'year';
  paymentMethod?: string;
};

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Mobile Payment',
  'Other',
];

const DATE_FILTERS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export default function HistoryScreen() {
  const { transactions, isDarkMode, getSelectedCurrency } = useAppContext();
  const [filters, setFilters] = useState<Filter>({});
  
  const activeTheme = isDarkMode ? theme.colors.dark : theme.colors.light;
  const selectedCurrency = getSelectedCurrency();

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter(transaction => {
    const now = new Date();
    const transactionDate = new Date(transaction.date);
    
    // Type filter
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    
    // Payment method filter
    if (filters.paymentMethod && transaction.paymentMethod !== filters.paymentMethod) {
      return false;
    }
    
    // Date filter
    if (filters.date) {
      switch (filters.date) {
        case 'today':
          return (
            transactionDate.getDate() === now.getDate() &&
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return transactionDate >= weekAgo;
        case 'month':
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear();
      }
    }
    
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups: Record<string, Transaction[]>, transaction) => {
    const date = format.date(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Transaction History</Text>
      </View>
      
      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {/* Type filters */}
        <View style={styles.filterGroup}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              !filters.type && styles.filterChipActive,
            ]}
            onPress={() => setFilters({ ...filters, type: undefined })}
          >
            <FilterX size={16} color={!filters.type ? 'white' : theme.colors.primary} />
            <Text style={[styles.filterChipText, !filters.type && styles.filterChipTextActive]}>
              All Types
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterChip,
              filters.type === 'income' && styles.filterChipActive,
            ]}
            onPress={() => setFilters({ ...filters, type: 'income' })}
          >
            <Text style={[
              styles.filterChipText,
              filters.type === 'income' && styles.filterChipTextActive,
            ]}>
              Income
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterChip,
              filters.type === 'expense' && styles.filterChipActive,
            ]}
            onPress={() => setFilters({ ...filters, type: 'expense' })}
          >
            <Text style={[
              styles.filterChipText,
              filters.type === 'expense' && styles.filterChipTextActive,
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Date filters */}
        <View style={styles.filterGroup}>
          {DATE_FILTERS.map(filter => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                filters.date === filter.value && styles.filterChipActive,
              ]}
              onPress={() => setFilters({ ...filters, date: filter.value as any })}
            >
              <Calendar size={16} color={filters.date === filter.value ? 'white' : theme.colors.primary} />
              <Text style={[
                styles.filterChipText,
                filters.date === filter.value && styles.filterChipTextActive,
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Payment method filters */}
        <View style={styles.filterGroup}>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method}
              style={[
                styles.filterChip,
                filters.paymentMethod === method && styles.filterChipActive,
              ]}
              onPress={() => setFilters({ ...filters, paymentMethod: method })}
            >
              <CreditCard size={16} color={filters.paymentMethod === method ? 'white' : theme.colors.primary} />
              <Text style={[
                styles.filterChipText,
                filters.paymentMethod === method && styles.filterChipTextActive,
              ]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Transactions List */}
      <ScrollView style={styles.transactionsList}>
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <Animated.View
            key={date}
            entering={FadeIn.duration(300)}
            layout={Layout.springify()}
          >
            <Text style={[styles.dateHeader, { color: activeTheme.text }]}>{date}</Text>
            
            {transactions.map(transaction => (
              <Animated.View
                key={transaction.id}
                style={[styles.transactionItem, { backgroundColor: activeTheme.card }]}
                entering={FadeIn.duration(300)}
                layout={Layout.springify()}
              >
                <View style={styles.transactionIcon}>
                  {getCategoryIcon(transaction.category, transaction.type)}
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionCategory, { color: activeTheme.text }]}>
                    {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                  </Text>
                  
                  {transaction.paymentMethod && (
                    <View style={styles.paymentMethodContainer}>
                      <CreditCard size={12} color={activeTheme.subtext} />
                      <Text style={[styles.paymentMethodText, { color: activeTheme.subtext }]}>
                        {transaction.paymentMethod}
                      </Text>
                    </View>
                  )}
                  
                  {transaction.notes && (
                    <Text style={[styles.transactionNotes, { color: activeTheme.subtext }]}>
                      {transaction.notes}
                    </Text>
                  )}
                </View>
                
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? theme.colors.success : theme.colors.error }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {format.currency(transaction.amount, selectedCurrency.code)}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>
        ))}
        
        {filteredTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: activeTheme.subtext }]}>
              No transactions found matching your filters.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  filterGroup: {
    flexDirection: 'row',
    marginRight: theme.spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.roundness.full,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    marginLeft: 4,
    color: theme.colors.primary,
  },
  filterChipTextActive: {
    color: 'white',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  dateHeader: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
    marginVertical: theme.spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light.sm,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
    marginBottom: 2,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  paymentMethodText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.xs,
    marginLeft: 4,
  },
  transactionNotes: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    marginTop: 2,
  },
  transactionAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    textAlign: 'center',
  },
});