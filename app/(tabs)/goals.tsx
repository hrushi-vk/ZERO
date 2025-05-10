import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Goal, GoalCategory } from '@/types';
import { Plus, X, Target, CalendarClock, Tag, BadgeDollarSign, Check, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Goal categories
const GOAL_CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: 'savings', label: 'Savings' },
  { value: 'debt_repayment', label: 'Debt Repayment' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'travel', label: 'Travel' },
  { value: 'education', label: 'Education' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'home', label: 'Home' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'gadget', label: 'Gadget' },
  { value: 'other', label: 'Other' },
];

// Goal templates
const GOAL_TEMPLATES = [
  { name: 'Emergency Fund', category: 'emergency_fund', targetAmount: 10000 },
  { name: 'Vacation', category: 'travel', targetAmount: 2000 },
  { name: 'New Phone', category: 'gadget', targetAmount: 1000 },
  { name: 'Down Payment', category: 'home', targetAmount: 20000 },
];

// Goal colors
const GOAL_COLORS = [
  '#8b5cf6', '#6366f1', '#3b82f6', '#2dd4bf', 
  '#f97316', '#ef4444', '#ec4899', '#34d399',
];

export default function GoalsScreen() {
  const { goals, addGoal, updateGoal, deleteGoal, isDarkMode, getSelectedCurrency } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Partial<Goal>>({
    name: '',
    category: 'savings',
    targetAmount: 0,
    currentAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    color: GOAL_COLORS[0],
  });
  const [editMode, setEditMode] = useState(false);
  const [fundGoalModalVisible, setFundGoalModalVisible] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  
  const activeTheme = isDarkMode ? theme.colors.dark : theme.colors.light;
  const selectedCurrency = getSelectedCurrency();

  // Handle creating/updating a goal
  const handleSaveGoal = () => {
    if (!currentGoal.name || !currentGoal.targetAmount) return;
    
    if (editMode && currentGoal.id) {
      // Update existing goal
      updateGoal(currentGoal.id, currentGoal);
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        name: currentGoal.name || '',
        category: currentGoal.category as GoalCategory || 'savings',
        targetAmount: currentGoal.targetAmount || 0,
        currentAmount: currentGoal.currentAmount || 0,
        startDate: currentGoal.startDate || new Date().toISOString().split('T')[0],
        endDate: currentGoal.endDate,
        notes: currentGoal.notes,
        color: currentGoal.color || GOAL_COLORS[Math.floor(Math.random() * GOAL_COLORS.length)],
      };
      
      addGoal(newGoal);
    }
    
    // Reset form and close modal
    setModalVisible(false);
    setCurrentGoal({
      name: '',
      category: 'savings',
      targetAmount: 0,
      currentAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      color: GOAL_COLORS[0],
    });
    setEditMode(false);
  };
  
  // Handle adding funds to a goal
  const handleFundGoal = () => {
    if (!selectedGoalId || !fundAmount) return;
    
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const selectedGoal = goals.find(g => g.id === selectedGoalId);
    if (!selectedGoal) return;
    
    const newAmount = selectedGoal.currentAmount + amount;
    updateGoal(selectedGoalId, { currentAmount: newAmount });
    
    // Reset form and close modal
    setFundGoalModalVisible(false);
    setFundAmount('');
    setSelectedGoalId(null);
  };
  
  // Open edit goal modal
  const handleEditGoal = (goal: Goal) => {
    setCurrentGoal(goal);
    setEditMode(true);
    setModalVisible(true);
  };
  
  // Open fund goal modal
  const handleOpenFundGoalModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setFundGoalModalVisible(true);
  };
  
  // Use a template
  const useTemplate = (template: typeof GOAL_TEMPLATES[0]) => {
    setCurrentGoal({
      ...currentGoal,
      name: template.name,
      category: template.category as GoalCategory,
      targetAmount: template.targetAmount,
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Financial Goals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setEditMode(false);
            setCurrentGoal({
              name: '',
              category: 'savings',
              targetAmount: 0,
              currentAmount: 0,
              startDate: new Date().toISOString().split('T')[0],
              color: GOAL_COLORS[Math.floor(Math.random() * GOAL_COLORS.length)],
            });
            setModalVisible(true);
          }}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Goals List */}
      <ScrollView
        style={styles.goalsList}
        contentContainerStyle={styles.goalsContent}
      >
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: activeTheme.subtext }]}>
              No goals set yet. Create your first financial goal!
            </Text>
          </View>
        ) : (
          goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            
            return (
              <View 
                key={goal.id}
                style={[styles.goalItem, { backgroundColor: activeTheme.card }]}
              >
                <View style={styles.goalHeader}>
                  <View style={[styles.goalIcon, { backgroundColor: goal.color || theme.colors.primary }]}>
                    <Target size={20} color="white" />
                  </View>
                  
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalName, { color: activeTheme.text }]}>{goal.name}</Text>
                    <Text style={[styles.goalCategory, { color: activeTheme.subtext }]}>
                      {GOAL_CATEGORIES.find(c => c.value === goal.category)?.label || 'Other'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.goalEditButton}
                    onPress={() => handleEditGoal(goal)}
                  >
                    <Pencil size={16} color={activeTheme.subtext} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.goalProgressContainer}>
                  <View style={styles.goalProgressInfo}>
                    <Text style={[styles.goalProgressText, { color: activeTheme.text }]}>
                      {format.currency(goal.currentAmount, selectedCurrency.code)} of {format.currency(goal.targetAmount, selectedCurrency.code)}
                    </Text>
                    <Text style={[styles.goalProgressPercent, { color: goal.color || theme.colors.primary }]}>
                      {format.percent(progress)}
                    </Text>
                  </View>
                  
                  <View style={styles.goalProgressBar}>
                    <LinearGradient
                      colors={[goal.color || '#8b5cf6', goal.color ? `${goal.color}88` : '#6366f1']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.goalProgressFill,
                        { width: `${Math.min(progress, 100)}%` }
                      ]}
                    />
                  </View>
                </View>
                
                {goal.endDate && (
                  <View style={styles.goalDeadline}>
                    <CalendarClock size={14} color={activeTheme.subtext} />
                    <Text style={[styles.goalDeadlineText, { color: activeTheme.subtext }]}>
                      Target date: {format.date(goal.endDate)}
                    </Text>
                  </View>
                )}
                
                <View style={styles.goalActions}>
                  <TouchableOpacity 
                    style={[styles.goalActionButton, { backgroundColor: goal.color || theme.colors.primary }]}
                    onPress={() => handleOpenFundGoalModal(goal.id)}
                  >
                    <BadgeDollarSign size={16} color="white" />
                    <Text style={styles.goalActionButtonText}>Add Funds</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.goalActionButton, { backgroundColor: '#ef4444' }]}
                    onPress={() => deleteGoal(goal.id)}
                  >
                    <Trash2 size={16} color="white" />
                    <Text style={styles.goalActionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      
      {/* Add/Edit Goal Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setEditMode(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeTheme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: activeTheme.text }]}>
                {editMode ? 'Edit Goal' : 'New Goal'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  setEditMode(false);
                }}
              >
                <X size={24} color={activeTheme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              {/* Goal Name */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Goal Name*</Text>
              <View style={[styles.inputContainer, { backgroundColor: activeTheme.card }]}>
                <Target size={20} color={activeTheme.subtext} />
                <TextInput
                  style={[styles.textInput, { color: activeTheme.text }]}
                  placeholder="e.g., Emergency Fund"
                  placeholderTextColor={activeTheme.subtext}
                  value={currentGoal.name}
                  onChangeText={text => setCurrentGoal({ ...currentGoal, name: text })}
                />
              </View>
              
              {/* Templates (Only show for new goals) */}
              {!editMode && (
                <>
                  <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Templates</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.templatesContainer}
                  >
                    {GOAL_TEMPLATES.map((template, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.templateItem, { backgroundColor: activeTheme.card }]}
                        onPress={() => useTemplate(template)}
                      >
                        <Text style={[styles.templateName, { color: activeTheme.text }]}>
                          {template.name}
                        </Text>
                        <Text style={[styles.templateAmount, { color: activeTheme.subtext }]}>
                          {format.currency(template.targetAmount, selectedCurrency.code)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              )}
              
              {/* Category */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Category*</Text>
              <View style={styles.categoriesContainer}>
                {GOAL_CATEGORIES.map(category => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryItem,
                      { backgroundColor: activeTheme.card },
                      currentGoal.category === category.value && styles.categoryItemSelected,
                    ]}
                    onPress={() => setCurrentGoal({ ...currentGoal, category: category.value })}
                  >
                    <Text 
                      style={[
                        styles.categoryItemText,
                        { color: activeTheme.text },
                        currentGoal.category === category.value && styles.categoryItemTextSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Target Amount */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Target Amount*</Text>
              <View style={[styles.amountInputContainer, { backgroundColor: activeTheme.card }]}>
                <Text style={[styles.currencySymbol, { color: activeTheme.text }]}>
                  {selectedCurrency.symbol}
                </Text>
                <TextInput
                  style={[styles.amountInput, { color: activeTheme.text }]}
                  placeholder="0.00"
                  placeholderTextColor={activeTheme.subtext}
                  keyboardType="numeric"
                  value={currentGoal.targetAmount ? currentGoal.targetAmount.toString() : ''}
                  onChangeText={text => {
                    if (/^\d*\.?\d*$/.test(text)) {
                      setCurrentGoal({ ...currentGoal, targetAmount: text ? parseFloat(text) : 0 });
                    }
                  }}
                />
              </View>
              
              {/* Current Amount (if editing) */}
              {editMode && (
                <>
                  <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Current Amount</Text>
                  <View style={[styles.amountInputContainer, { backgroundColor: activeTheme.card }]}>
                    <Text style={[styles.currencySymbol, { color: activeTheme.text }]}>
                      {selectedCurrency.symbol}
                    </Text>
                    <TextInput
                      style={[styles.amountInput, { color: activeTheme.text }]}
                      placeholder="0.00"
                      placeholderTextColor={activeTheme.subtext}
                      keyboardType="numeric"
                      value={currentGoal.currentAmount ? currentGoal.currentAmount.toString() : '0'}
                      onChangeText={text => {
                        if (/^\d*\.?\d*$/.test(text)) {
                          setCurrentGoal({ ...currentGoal, currentAmount: text ? parseFloat(text) : 0 });
                        }
                      }}
                    />
                  </View>
                </>
              )}
              
              {/* Target Date (Optional) */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Target Date (Optional)</Text>
              <View style={[styles.inputContainer, { backgroundColor: activeTheme.card }]}>
                <CalendarClock size={20} color={activeTheme.subtext} />
                <TextInput
                  style={[styles.textInput, { color: activeTheme.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={activeTheme.subtext}
                  value={currentGoal.endDate}
                  onChangeText={text => setCurrentGoal({ ...currentGoal, endDate: text })}
                />
              </View>
              
              {/* Notes (Optional) */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Notes (Optional)</Text>
              <View style={[styles.inputContainer, { backgroundColor: activeTheme.card }]}>
                <Tag size={20} color={activeTheme.subtext} />
                <TextInput
                  style={[styles.textInput, { color: activeTheme.text }]}
                  placeholder="Add notes here..."
                  placeholderTextColor={activeTheme.subtext}
                  value={currentGoal.notes}
                  onChangeText={text => setCurrentGoal({ ...currentGoal, notes: text })}
                  multiline
                />
              </View>
              
              {/* Color Selection */}
              <Text style={[styles.inputLabel, { color: activeTheme.text }]}>Goal Color</Text>
              <View style={styles.colorContainer}>
                {GOAL_COLORS.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorItem,
                      { backgroundColor: color },
                      currentGoal.color === color && styles.colorItemSelected,
                    ]}
                    onPress={() => setCurrentGoal({ ...currentGoal, color })}
                  >
                    {currentGoal.color === color && (
                      <Check size={16} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!currentGoal.name || !currentGoal.targetAmount) && styles.saveButtonDisabled,
              ]}
              onPress={handleSaveGoal}
              disabled={!currentGoal.name || !currentGoal.targetAmount}
            >
              <Text style={styles.saveButtonText}>
                {editMode ? 'Update Goal' : 'Create Goal'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Fund Goal Modal */}
      <Modal
        visible={fundGoalModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFundGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeTheme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: activeTheme.text }]}>Add Funds to Goal</Text>
              <TouchableOpacity onPress={() => setFundGoalModalVisible(false)}>
                <X size={24} color={activeTheme.text} />
              </TouchableOpacity>
            </View>
            
            {selectedGoalId && (
              <View style={styles.fundGoalContent}>
                <Text style={[styles.fundGoalText, { color: activeTheme.text }]}>
                  How much would you like to add to
                  {' '}
                  <Text style={styles.fundGoalName}>
                    {goals.find(g => g.id === selectedGoalId)?.name}
                  </Text>
                  ?
                </Text>
                
                <View style={[styles.amountInputContainer, { backgroundColor: activeTheme.card }]}>
                  <Text style={[styles.currencySymbol, { color: activeTheme.text }]}>
                    {selectedCurrency.symbol}
                  </Text>
                  <TextInput
                    style={[styles.amountInput, { color: activeTheme.text }]}
                    placeholder="0.00"
                    placeholderTextColor={activeTheme.subtext}
                    keyboardType="numeric"
                    value={fundAmount}
                    onChangeText={text => {
                      if (/^\d*\.?\d*$/.test(text)) {
                        setFundAmount(text);
                      }
                    }}
                    autoFocus
                  />
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.fundButton,
                    !fundAmount && styles.fundButtonDisabled,
                  ]}
                  onPress={handleFundGoal}
                  disabled={!fundAmount}
                >
                  <Text style={styles.fundButtonText}>Add Funds</Text>
                </TouchableOpacity>
              </View>
            )}
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
  goalsList: {
    flex: 1,
  },
  goalsContent: {
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
  goalItem: {
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.light.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.lg,
    marginBottom: 2,
  },
  goalCategory: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
  },
  goalEditButton: {
    padding: theme.spacing.sm,
  },
  goalProgressContainer: {
    marginBottom: theme.spacing.md,
  },
  goalProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  goalProgressText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  goalProgressPercent: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.roundness.full,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: theme.roundness.full,
  },
  goalDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  goalDeadlineText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    marginLeft: theme.spacing.sm,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.roundness.md,
    flex: 0.48,
    justifyContent: 'center',
  },
  goalActionButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
    color: 'white',
    marginLeft: theme.spacing.sm,
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
  templatesContainer: {
    flexDirection: 'row',
    paddingBottom: theme.spacing.sm,
  },
  templateItem: {
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginRight: theme.spacing.md,
    minWidth: 120,
  },
  templateName: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
    marginBottom: 2,
  },
  templateAmount: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
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
    textAlign: 'center',
  },
  categoryItemTextSelected: {
    color: theme.colors.primary,
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
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorItemSelected: {
    borderWidth: 2,
    borderColor: 'white',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: 'white',
  },
  fundGoalContent: {
    marginTop: theme.spacing.md,
  },
  fundGoalText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  fundGoalName: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
  },
  fundButton: {
    backgroundColor: theme.colors.success,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  fundButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  fundButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: 'white',
  },
});