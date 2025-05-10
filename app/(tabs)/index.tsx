import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';
import { ChevronRight, AlertCircle, Award, TrendingUp, TrendingDown } from 'lucide-react-native';
import { generateAIInsights } from '@/utils/aiHelpers';
import { AIInsight, Transaction } from '@/types';
import RecentTransactionsList from '@/components/dashboard/RecentTransactionsList';
import DashboardMetric from '@/components/dashboard/DashboardMetric';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { VictoryPie } from 'victory-native';

export default function DashboardScreen() {
  const { userData, transactions, goals, currentBalance, isDarkMode } = useAppContext();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  
  const activeTheme = isDarkMode ? theme.colors.dark : theme.colors.light;
  
  // Calculate financial metrics based on transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const selectedCurrency = userData?.currency || 'USD';
  
  // Filter transactions based on time range
  const getFilteredTransactions = (): Transaction[] => {
    const now = new Date();
    let filterDate = new Date();
    
    if (timeRange === 'daily') {
      filterDate.setDate(now.getDate() - 1);
    } else if (timeRange === 'weekly') {
      filterDate.setDate(now.getDate() - 7);
    } else {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return transactions.filter(t => new Date(t.date) >= filterDate);
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Calculate filtered metrics
  const filteredIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const filteredExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Generate expense breakdown data for pie chart
  const expenseBreakdown = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
  const pieChartData = Object.entries(expenseBreakdown).map(([category, amount]) => ({
    x: category,
    y: amount,
    label: `${category}: ${format.currency(amount, selectedCurrency)}`,
  }));
  
  // Calculate total goal progress
  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const goalProgress = totalGoalTarget > 0 ? (totalGoalCurrent / totalGoalTarget) * 100 : 0;
  
  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Generate AI insights
  useEffect(() => {
    if (transactions.length > 0) {
      const generatedInsights = generateAIInsights(transactions, userData);
      setInsights(generatedInsights);
    }
  }, [transactions, userData]);
  
  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <DashboardHeader name={userData?.name || 'User'} balance={currentBalance} currency={selectedCurrency} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Time range selector */}
        <View style={styles.timeRangeSelector}>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === 'daily' && [styles.timeRangeButtonActive, { backgroundColor: theme.colors.primary }]
            ]}
            onPress={() => setTimeRange('daily')}
          >
            <Text style={[
              styles.timeRangeButtonText,
              timeRange === 'daily' && styles.timeRangeButtonTextActive
            ]}>
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === 'weekly' && [styles.timeRangeButtonActive, { backgroundColor: theme.colors.primary }]
            ]}
            onPress={() => setTimeRange('weekly')}
          >
            <Text style={[
              styles.timeRangeButtonText,
              timeRange === 'weekly' && styles.timeRangeButtonTextActive
            ]}>
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === 'monthly' && [styles.timeRangeButtonActive, { backgroundColor: theme.colors.primary }]
            ]}
            onPress={() => setTimeRange('monthly')}
          >
            <Text style={[
              styles.timeRangeButtonText,
              timeRange === 'monthly' && styles.timeRangeButtonTextActive
            ]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Metrics */}
        <View style={styles.metricsContainer}>
          <DashboardMetric
            title="Income"
            value={filteredIncome}
            currency={selectedCurrency}
            icon={<TrendingUp size={20} color={theme.colors.success} />}
            style={{ backgroundColor: isDarkMode ? '#1B2631' : '#F0FDF4' }}
          />
          <DashboardMetric
            title="Expenses"
            value={filteredExpenses}
            currency={selectedCurrency}
            icon={<TrendingDown size={20} color={theme.colors.error} />}
            style={{ backgroundColor: isDarkMode ? '#2C2730' : '#FEF2F2' }}
          />
        </View>
        
        {/* Goals Progress */}
        {goals.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: activeTheme.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Goals Progress</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.goalProgressContainer}>
              <View style={styles.goalProgressBar}>
                <LinearGradient
                  colors={['#8b5cf6', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.goalProgressFill,
                    { width: `${Math.min(goalProgress, 100)}%` }
                  ]}
                />
              </View>
              <Text style={[styles.goalProgressText, { color: activeTheme.subtext }]}>
                {goalProgress.toFixed(0)}% of total goal amount reached
              </Text>
            </View>
          </View>
        )}
        
        {/* AI Insights */}
        {insights.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: activeTheme.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>AI Insights</Text>
            </View>
            
            {insights.slice(0, 2).map((insight) => (
              <View key={insight.id} style={styles.insightItem}>
                <View style={styles.insightIconContainer}>
                  {insight.type === 'alert' ? (
                    <AlertCircle size={20} color={theme.colors.warning} />
                  ) : (
                    <Award size={20} color={theme.colors.primary} />
                  )}
                </View>
                <View style={styles.insightContent}>
                  <Text style={[styles.insightTitle, { color: activeTheme.text }]}>{insight.title}</Text>
                  <Text style={[styles.insightDescription, { color: activeTheme.subtext }]}>
                    {insight.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Expense Breakdown */}
        {pieChartData.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: activeTheme.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Expense Breakdown</Text>
            </View>
            
            <View style={styles.chartContainer}>
              <VictoryPie
                data={pieChartData}
                colorScale={['#8b5cf6', '#6366f1', '#3b82f6', '#2dd4bf', '#f97316', '#ef4444']}
                width={280}
                height={280}
                innerRadius={50}
                padding={30}
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
        
        {/* Recent Transactions */}
        <View style={[styles.sectionCard, { backgroundColor: activeTheme.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Recent Transactions</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <RecentTransactionsList 
            transactions={recentTransactions} 
            currency={selectedCurrency}
            isDarkMode={isDarkMode}
          />
        </View>
        
        {/* Bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: 'transparent',
    borderRadius: theme.roundness.md,
    overflow: 'hidden',
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  timeRangeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  timeRangeButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    color: '#666',
  },
  timeRangeButtonTextActive: {
    color: 'white',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionCard: {
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.light.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary,
  },
  goalProgressContainer: {
    marginVertical: theme.spacing.sm,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.roundness.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: theme.roundness.full,
  },
  goalProgressText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    textAlign: 'right',
  },
  insightItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  insightIconContainer: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.sm,
    borderRadius: theme.roundness.full,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
    marginBottom: 4,
  },
  insightDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
});