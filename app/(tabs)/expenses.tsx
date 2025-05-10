import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { ExpenseCategory, Transaction } from '@/types';
import { Plus, X, Calendar, Tag, Pencil, FilterX, CreditCard } from 'lucide-react-native';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { VictoryPie } from 'victory-native';

// Expense categories
const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'housing', label: 'Housing' },
  { value: 'transportation', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'personal', label: 'Personal' },
  { value: 'debt', label: 'Debt' },
  { value: 'savings', label: 'Savings' },
  { value: 'gifts', label: 'Gifts' },
  { value: 'other', label: 'Other' },
];

// Payment methods
const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Mobile Payment',
  'Other',
];

export default function ExpensesScreen() {
  const { transactions, addTransaction, isDarkMode, getSelectedCurrency } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '' as ExpenseCategory,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    paymentMethod: '',
  });
  const [filter, setFilter] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(true);
  
  const activeTheme = isDarkMode ? theme.colors.dark : theme.colors.light;
  const selectedCurrency = getSelectedCurrency();

  // Filter expense transactions
  const expenseTransactions = transactions
    .filter(t => t.type === 'expense')
    .filter(t => filter ? t.category === filter : true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate total expenses
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Generate expense breakdown data for pie chart
  const expenseBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
  const pieChartData = Object.entries(expenseBreakdown)
    .map(([category, amount]) => ({
      x: category,
      y: amount,
      label: `${category}: ${((amount / totalExpenses) * 100).toFixed(0)}%`,
    }))
    .sort((a, b) => b.y - a.y)
    .slice(0, 5); // Top 5 categories
  
  // Handle adding new expense
  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category) return;
    
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) return;
    
    const expenseTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'expense',
      amount,
      category: newExpense.category,
      date: newExpense.date,
      notes: newExpense.notes || undefined,
      paymentMethod: newExpense.paymentMethod || undefined,
    };
    
    addTransaction(expenseTransaction);
    setModalVisible(false);
    
    // Reset form
    setNewExpense({
      amount: '',
      category: '' as ExpenseCategory,
      date: new Date().toISOString().split('T')[0],
      notes: '',
      paymentMethod: '',
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Expenses</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Summary */}
      <View style={[styles.summaryCard, { backgroundColor: activeTheme.card }]}>
        <Text style={[styles.summaryLabel, { color: activeTheme.subtext }]}>Total Expenses</Text>
        <Text style={[styles.summaryAmount, { color: activeTheme.text }]}>
          {format.currency(totalExpenses, selectedCurrency.code)}
        </Text>
        
        {/* Toggle chart view */}
        <TouchableOpacity 
          style={styles.toggleChartButton}
          onPress={() => setShowChart(!showChart)}
        >
          <Text style={styles.toggleChartText}>
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Chart */}
      {showChart && pieChartData.length > 0 && (
        <View style={[styles.chartCard, { backgroundColor: activeTheme.card }]}>
          <Text style={[styles.chartTitle, { color: activeTheme.text }]}>Top Expense Categories</Text>
          <View style={styles.chartContainer}>
            <VictoryPie
              data={pieChartData}
              colorScale={['#8b5cf6', '#6366f1', '#3b82f6', '#2dd4bf', '#f97316']}
              width={280}
              height={200}
              padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
              innerRadius={40}
              labelRadius={({ innerRadius }) => (innerRadius as number) + 30}
              style={{
                labels: {
                  fill: activeTheme.text,
                  fontSize: 10,
                  fontFamily: theme.typography.fontFamily.medium,
                }
              }}
            />
          </View>
        </View>
      )}
      
      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === null && styles.filterChipActive,
          ]}
          onPress={() => setFilter(null)}
        >
          <FilterX size={16} color={filter === null ? 'white' : theme.colors.primary} />
          <Text 
            style={[
              styles.filterChipText,
              filter === null && styles.filterChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {EXPENSE_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.filterChip,
              filter === category.value && styles.filterChipActive,
            ]}
            onPress={() => setFilter(category.value)}
          >
            {getCategoryIcon(category.value, 'expense')}
            <Text 
              style={[
                styles.filterChipText,
                filter === category.value && styles.filterChipTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Expense List */}
      <ScrollView
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsContent}
      >
        {expenseTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: activeTheme.subtext }]}>
              No expense transactions found. Add your first expense!
            </Text>
          </View>
        ) : (
          expenseTransactions.map(transaction => (
            <View 
              key={transaction.id}
              style={[styles.transactionItem, { backgroundColor: activeTheme.card }]}
            >
              <View style={styles.transactionIcon}>
                {getCategoryIcon(transaction.category, 'expense')}
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionCategory, { color: activeTheme.text }]}>
                  {EXPENSE_CATEGORIES.find(c => c.value === transaction.category)?.label || 'Other'}
                </Text>
                <Text style={[styles.transactionDate, { color: activeTheme.subtext }]}>
                  {format.date(transaction.date)}
                </Text>
                {transaction.paymentMethod && (
                  <View style={styles.paymentMethodContainer}>
                    <CreditCard size={12} color={activeTheme.subtext} />
                    <Text style={[styles.paymentMethodText, { color: activeTheme.subtext }]}>
                      {transaction.paymentMethod}
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.transactionAmount}>
                -{format.currency(transaction.amount, selectedCurrency.code)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      
      {/* Add Expense Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeTheme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: activeTheme.text }]}>Add Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={activeTheme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              {/* Amount */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Amount*</Text>
              <View style={[styles.amountInputContainer, { backgroundColor: activeTheme.card }]}>
                <Text style={[styles.currencySymbol, { color: activeTheme.text }]}>
                  {selectedCurrency.symbol}
                </Text>
                <TextInput
                  style={[styles.amountInput, { color: activeTheme.text }]}
                  placeholder="0.00"
                  placeholderTextColor={activeTheme.subtext}
                  keyboardType="numeric"
                  value={newExpense.amount}
                  onChangeText={text => {
                    if (/^\d*\.?\d*$/.test(text)) {
                      setNewExpense({ ...newExpense, amount: text });
                    }
                  }}
                />
              </View>
              
              {/* Category */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Category*</Text>
              <View style={styles.categoriesContainer}>
                {EXPENSE_CATEGORIES.map(category => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryItem,
                      { backgroundColor: activeTheme.card },
                      newExpense.category === category.value && styles.categoryItemSelected,
                    ]}
                    onPress={() => setNewExpense({ ...newExpense, category: category.value })}
                  >
                    {getCategoryIcon(category.value, 'expense')}
                    <Text 
                      style={[
                        styles.categoryItemText,
                        { color: activeTheme.text },
                        newExpense.category === category.value && styles.categoryItemTextSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Date */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Date</Text>
              <View style={[styles.inputContainer, { backgroundColor: activeTheme.card }]}>
                <Calendar size={20} color={activeTheme.subtext} />
                <TextInput
                  style={[styles.textInput, { color: activeTheme.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={activeTheme.subtext}
                  value={newExpense.date}
                  onChangeText={text => setNewExpense({ ...newExpense, date: text })}
                />
              </View>
              
              {/* Payment Method */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Payment Method</Text>
              <View style={styles.paymentMethodsContainer}>
                {PAYMENT_METHODS.map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentMethodItem,
                      { backgroundColor: activeTheme.card },
                      newExpense.paymentMethod === method && styles.paymentMethodItemSelected,
                    ]}
                    onPress={() => setNewExpense({ ...newExpense, paymentMethod: method })}
                  >
                    <Text 
                      style={[
                        styles.paymentMethodItemText,
                        { color: activeTheme.text },
                        newExpense.paymentMethod === method && styles.paymentMethodItemTextSelected,
                      ]}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Notes */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Notes (Optional)</Text>
              <View style={[styles.inputContainer, { backgroundColor: activeTheme.card }]}>
                <Tag size={20} color={activeTheme.subtext} />
                <TextInput
                  style={[styles.textInput, { color: activeTheme.text }]}
                  placeholder="Add notes here..."
                  placeholderTextColor={activeTheme.subtext}
                  value={newExpense.notes}
                  onChangeText={text => setNewExpense({ ...newExpense, notes: text })}
                  multiline
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={[
                styles.addExpenseButton,
                (!newExpense.amount || !newExpense.category) && styles.addExpenseButtonDisabled,
              ]}
              onPress={handleAddExpense}
              disabled={!newExpense.amount || !newExpense.category}
            >
              <Text style={styles.addExpenseButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
  },
  addButton: {
    backgroundColor: theme.colors.error,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.roundness.md,
    ...theme.shadows.light.md,
  },
  summaryLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    marginBottom: theme.spacing.sm,
  },
  summaryAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxxl,
  },
  toggleChartButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  toggleChartText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary,
  },
  chartCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    ...theme.shadows.light.sm,
  },
  chartTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    flexDirection: 'row',
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
    backgroundColor: theme.colors.error,
  },
  filterChipText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    marginLeft: 4,
    color: theme.colors.error,
  },
  filterChipTextActive: {
    color: 'white',
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContent: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Extra padding at bottom
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
  transactionDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
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
  transactionAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: theme.colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: theme.roundness.lg,
    borderTopRightRadius: theme.roundness.lg,
    padding: theme.spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xl,
  },
  modalForm: {
    maxHeight: 500,
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
  },
  currencySymbol: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
    marginRight: theme.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xxl,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    width: '22%',
    margin: '1.5%',
    padding: theme.spacing.sm,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
  },
  categoryItemSelected: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  categoryItemText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  categoryItemTextSelected: {
    color: theme.colors.error,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  paymentMethodItem: {
    width: '30%',
    margin: '1.5%',
    padding: theme.spacing.sm,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
  },
  paymentMethodItemSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  paymentMethodItemText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    textAlign: 'center',
  },
  paymentMethodItemTextSelected: {
    color: theme.colors.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
  },
  textInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.md,
    marginLeft: theme.spacing.sm,
  },
  addExpenseButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  addExpenseButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  addExpenseButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: 'white',
  },
});