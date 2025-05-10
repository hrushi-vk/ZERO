import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { IncomeCategory, Transaction } from '@/types';
import { Plus, X, Calendar, Tag, Pencil, FilterX } from 'lucide-react-native';
import { getCategoryIcon } from '@/utils/categoryIcons';

// Income categories
const INCOME_CATEGORIES: { value: IncomeCategory; label: string }[] = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'business', label: 'Business' },
  { value: 'investments', label: 'Investments' },
  { value: 'gifts', label: 'Gifts' },
  { value: 'refunds', label: 'Refunds' },
  { value: 'other', label: 'Other' },
];

export default function IncomeScreen() {
  const { transactions, addTransaction, isDarkMode, getSelectedCurrency } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newIncome, setNewIncome] = useState({
    amount: '',
    category: '' as IncomeCategory,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [filter, setFilter] = useState<string | null>(null);
  
  const activeTheme = isDarkMode ? theme.colors.dark : theme.colors.light;
  const selectedCurrency = getSelectedCurrency();

  // Filter income transactions
  const incomeTransactions = transactions
    .filter(t => t.type === 'income')
    .filter(t => filter ? t.category === filter : true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate total income
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Handle adding new income
  const handleAddIncome = () => {
    if (!newIncome.amount || !newIncome.category) return;
    
    const amount = parseFloat(newIncome.amount);
    if (isNaN(amount) || amount <= 0) return;
    
    const incomeTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'income',
      amount,
      category: newIncome.category,
      date: newIncome.date,
      notes: newIncome.notes || undefined,
    };
    
    addTransaction(incomeTransaction);
    setModalVisible(false);
    
    // Reset form
    setNewIncome({
      amount: '',
      category: '' as IncomeCategory,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Income</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Summary */}
      <View style={[styles.summaryCard, { backgroundColor: activeTheme.card }]}>
        <Text style={[styles.summaryLabel, { color: activeTheme.subtext }]}>Total Income</Text>
        <Text style={[styles.summaryAmount, { color: activeTheme.text }]}>
          {format.currency(totalIncome, selectedCurrency.code)}
        </Text>
      </View>
      
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
        
        {INCOME_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.filterChip,
              filter === category.value && styles.filterChipActive,
            ]}
            onPress={() => setFilter(category.value)}
          >
            {getCategoryIcon(category.value, 'income')}
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
      
      {/* Income List */}
      <ScrollView
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsContent}
      >
        {incomeTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: activeTheme.subtext }]}>
              No income transactions found. Add your first income!
            </Text>
          </View>
        ) : (
          incomeTransactions.map(transaction => (
            <View 
              key={transaction.id}
              style={[styles.transactionItem, { backgroundColor: activeTheme.card }]}
            >
              <View style={styles.transactionIcon}>
                {getCategoryIcon(transaction.category, 'income')}
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionCategory, { color: activeTheme.text }]}>
                  {INCOME_CATEGORIES.find(c => c.value === transaction.category)?.label || 'Other'}
                </Text>
                <Text style={[styles.transactionDate, { color: activeTheme.subtext }]}>
                  {format.date(transaction.date)}
                </Text>
                {transaction.notes && (
                  <Text 
                    style={[styles.transactionNotes, { color: activeTheme.subtext }]}
                    numberOfLines={1}
                  >
                    {transaction.notes}
                  </Text>
                )}
              </View>
              
              <Text style={styles.transactionAmount}>
                +{format.currency(transaction.amount, selectedCurrency.code)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      
      {/* Add Income Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeTheme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: activeTheme.text }]}>Add Income</Text>
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
                  value={newIncome.amount}
                  onChangeText={text => {
                    if (/^\d*\.?\d*$/.test(text)) {
                      setNewIncome({ ...newIncome, amount: text });
                    }
                  }}
                />
              </View>
              
              {/* Category */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Category*</Text>
              <View style={styles.categoriesContainer}>
                {INCOME_CATEGORIES.map(category => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryItem,
                      { backgroundColor: activeTheme.card },
                      newIncome.category === category.value && styles.categoryItemSelected,
                    ]}
                    onPress={() => setNewIncome({ ...newIncome, category: category.value })}
                  >
                    {getCategoryIcon(category.value, 'income')}
                    <Text 
                      style={[
                        styles.categoryItemText,
                        { color: activeTheme.text },
                        newIncome.category === category.value && styles.categoryItemTextSelected,
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
                  value={newIncome.date}
                  onChangeText={text => setNewIncome({ ...newIncome, date: text })}
                />
              </View>
              
              {/* Notes */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Notes (Optional)</Text>
              <View style={[styles.inputContainer, { backgroundColor: activeTheme.card }]}>
                <Tag size={20} color={activeTheme.subtext} />
                <TextInput
                  style={[styles.textInput, { color: activeTheme.text }]}
                  placeholder="Add notes here..."
                  placeholderTextColor={activeTheme.subtext}
                  value={newIncome.notes}
                  onChangeText={text => setNewIncome({ ...newIncome, notes: text })}
                  multiline
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={[
                styles.addIncomeButton,
                (!newIncome.amount || !newIncome.category) && styles.addIncomeButtonDisabled,
              ]}
              onPress={handleAddIncome}
              disabled={!newIncome.amount || !newIncome.category}
            >
              <Text style={styles.addIncomeButtonText}>Add Income</Text>
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
    backgroundColor: theme.colors.primary,
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
  transactionNotes: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    marginTop: 2,
  },
  transactionAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: theme.colors.success,
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
    width: '30%',
    margin: '1.5%',
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
  },
  categoryItemSelected: {
    backgroundColor: theme.colors.light.highlight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  categoryItemText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  categoryItemTextSelected: {
    color: theme.colors.primary,
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
  addIncomeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  addIncomeButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  addIncomeButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: 'white',
  },
});