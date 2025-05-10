import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format } from '@/utils/formatters';
import theme from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { generateAIInsights } from '@/utils/aiHelpers';
import { AIInsight } from '@/types';
import { AlertCircle, Award, TrendingUp, Lightbulb, Clock } from 'lucide-react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryLegend, VictoryTheme } from 'victory-native';

export default function InsightsScreen() {
  const { transactions, userData, isDarkMode } = useAppContext();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  const activeTheme = isDarkMode ? theme.colors.dark : theme.colors.light;
  
  // Generate AI insights
  useEffect(() => {
    if (transactions.length > 0) {
      const generatedInsights = generateAIInsights(transactions, userData);
      setInsights(generatedInsights);
    }
  }, [transactions, userData]);
  
  // Prepare chart data
  const getChartData = () => {
    if (transactions.length === 0) return { income: [], expenses: [] };
    
    const now = new Date();
    let startDate = new Date();
    let groupFormat: 'day' | 'month' | 'year';
    
    if (timeRange === 'weekly') {
      startDate.setDate(now.getDate() - 7);
      groupFormat = 'day';
    } else if (timeRange === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
      groupFormat = 'day';
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
      groupFormat = 'month';
    }
    
    // Filter transactions in the selected time range
    const filteredTransactions = transactions.filter(t => 
      new Date(t.date) >= startDate && new Date(t.date) <= now
    );
    
    // Group transactions by date
    const groupedData: Record<string, { date: string; income: number; expenses: number }> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let groupKey: string;
      
      if (groupFormat === 'day') {
        groupKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      } else {
        groupKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = { date: groupKey, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        groupedData[groupKey].income += transaction.amount;
      } else {
        groupedData[groupKey].expenses += transaction.amount;
      }
    });
    
    // Convert to array and sort by date
    const sortedData = Object.values(groupedData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Format for chart
    const incomeData = sortedData.map((item, index) => ({ x: index + 1, y: item.income }));
    const expensesData = sortedData.map((item, index) => ({ x: index + 1, y: item.expenses }));
    
    return { income: incomeData, expenses: expensesData };
  };
  
  const chartData = getChartData();
  
  // Get financial summary
  const getFinancialSummary = () => {
    const incomeTotal = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expensesTotal = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const savingsRate = incomeTotal > 0 
      ? ((incomeTotal - expensesTotal) / incomeTotal) * 100 
      : 0;
      
    // Get top expense category
    const expenseCategories = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      
    let topExpenseCategory = '';
    let topExpenseAmount = 0;
    
    Object.entries(expenseCategories).forEach(([category, amount]) => {
      if (amount > topExpenseAmount) {
        topExpenseCategory = category;
        topExpenseAmount = amount;
      }
    });
    
    return {
      incomeTotal,
      expensesTotal,
      savingsRate,
      topExpenseCategory,
      topExpenseAmount,
    };
  };
  
  const financialSummary = getFinancialSummary();
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle size={24} color={theme.colors.warning} />;
      case 'tip':
        return <Lightbulb size={24} color={theme.colors.primary} />;
      case 'trend':
        return <TrendingUp size={24} color={theme.colors.secondary} />;
      case 'recommendation':
        return <Award size={24} color={theme.colors.success} />;
      default:
        return <Lightbulb size={24} color={theme.colors.primary} />;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>AI Insights</Text>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Time Selector for Charts */}
        <View style={styles.timeRangeSelector}>
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
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === 'yearly' && [styles.timeRangeButtonActive, { backgroundColor: theme.colors.primary }]
            ]}
            onPress={() => setTimeRange('yearly')}
          >
            <Text style={[
              styles.timeRangeButtonText,
              timeRange === 'yearly' && styles.timeRangeButtonTextActive
            ]}>
              Yearly
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Income vs Expenses Chart */}
        {(chartData.income.length > 0 || chartData.expenses.length > 0) ? (
          <View style={[styles.chartCard, { backgroundColor: activeTheme.card }]}>
            <Text style={[styles.chartTitle, { color: activeTheme.text }]}>Income vs Expenses</Text>
            
            <View style={styles.chartContainer}>
              <VictoryChart
                theme={VictoryTheme.material}
                height={250}
                padding={{ top: 10, bottom: 40, left: 50, right: 10 }}
              >
                <VictoryLegend
                  x={125}
                  y={10}
                  orientation="horizontal"
                  gutter={20}
                  style={{ 
                    labels: { 
                      fill: isDarkMode ? '#FFF' : '#000',
                      fontSize: 12,
                      fontFamily: theme.typography.fontFamily.medium,
                    } 
                  }}
                  data={[
                    { name: "Income", symbol: { fill: theme.colors.success } },
                    { name: "Expenses", symbol: { fill: theme.colors.error } },
                  ]}
                />
                <VictoryAxis
                  style={{
                    tickLabels: { 
                      fill: isDarkMode ? '#FFF' : '#000',
                      fontSize: 8,
                      fontFamily: theme.typography.fontFamily.regular,
                    },
                    axis: { stroke: isDarkMode ? '#555' : '#DDD' },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    tickLabels: { 
                      fill: isDarkMode ? '#FFF' : '#000',
                      fontSize: 8,
                      fontFamily: theme.typography.fontFamily.regular,
                    },
                    axis: { stroke: isDarkMode ? '#555' : '#DDD' },
                  }}
                />
                <VictoryLine
                  data={chartData.income}
                  style={{ data: { stroke: theme.colors.success, strokeWidth: 2 } }}
                />
                <VictoryLine
                  data={chartData.expenses}
                  style={{ data: { stroke: theme.colors.error, strokeWidth: 2 } }}
                />
              </VictoryChart>
            </View>
          </View>
        ) : (
          <View style={[styles.emptyChartCard, { backgroundColor: activeTheme.card }]}>
            <Text style={[styles.emptyChartText, { color: activeTheme.text }]}>
              Not enough data to display the chart.
              Add more transactions to see trends.
            </Text>
          </View>
        )}
        
        {/* Financial Summary */}
        {transactions.length > 0 && (
          <View style={[styles.summaryCard, { backgroundColor: activeTheme.card }]}>
            <Text style={[styles.summaryTitle, { color: activeTheme.text }]}>Financial Summary</Text>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: activeTheme.subtext }]}>Savings Rate:</Text>
              <Text 
                style={[
                  styles.summaryValue, 
                  { 
                    color: financialSummary.savingsRate >= 0 
                      ? theme.colors.success 
                      : theme.colors.error 
                  }
                ]}
              >
                {financialSummary.savingsRate.toFixed(1)}%
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: activeTheme.subtext }]}>Top Expense Category:</Text>
              <Text style={[styles.summaryValue, { color: activeTheme.text }]}>
                {financialSummary.topExpenseCategory.charAt(0).toUpperCase() + financialSummary.topExpenseCategory.slice(1)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: activeTheme.subtext }]}>Income to Expense Ratio:</Text>
              <Text 
                style={[
                  styles.summaryValue, 
                  { 
                    color: financialSummary.expensesTotal <= financialSummary.incomeTotal
                      ? theme.colors.success 
                      : theme.colors.error 
                  }
                ]}
              >
                {financialSummary.incomeTotal > 0 
                  ? (financialSummary.incomeTotal / financialSummary.expensesTotal).toFixed(2)
                  : '0.00'
                }
              </Text>
            </View>
          </View>
        )}
        
        {/* AI Insights */}
        <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Personalized Insights</Text>
        
        {insights.length === 0 ? (
          <View style={[styles.emptyInsightsCard, { backgroundColor: activeTheme.card }]}>
            <Text style={[styles.emptyInsightsText, { color: activeTheme.text }]}>
              Add more transactions to get personalized financial insights.
            </Text>
          </View>
        ) : (
          insights.map(insight => (
            <View 
              key={insight.id}
              style={[styles.insightCard, { backgroundColor: activeTheme.card }]}
            >
              <View style={styles.insightHeader}>
                <View style={styles.insightIconContainer}>
                  {getInsightIcon(insight.type)}
                </View>
                <View style={styles.insightMeta}>
                  <Text style={[styles.insightType, { color: activeTheme.text }]}>
                    {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                  </Text>
                  <View style={styles.insightDateContainer}>
                    <Clock size={12} color={activeTheme.subtext} />
                    <Text style={[styles.insightDate, { color: activeTheme.subtext }]}>
                      {format.date(insight.date)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.insightTitle, { color: activeTheme.text }]}>{insight.title}</Text>
              <Text style={[styles.insightDescription, { color: activeTheme.subtext }]}>
                {insight.description}
              </Text>
            </View>
          ))
        )}
        
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
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
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
  chartCard: {
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light.md,
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
  emptyChartCard: {
    borderRadius: theme.roundness.md,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.light.sm,
  },
  emptyChartText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light.md,
  },
  summaryTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  summaryLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
  },
  summaryValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.lg,
    marginVertical: theme.spacing.md,
  },
  emptyInsightsCard: {
    borderRadius: theme.roundness.md,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.light.sm,
  },
  emptyInsightsText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    textAlign: 'center',
  },
  insightCard: {
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light.md,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  insightMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  insightType: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
  },
  insightDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.xs,
    marginLeft: 4,
  },
  insightTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.lg,
    marginBottom: theme.spacing.sm,
  },
  insightDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.md,
    lineHeight: 22,
  },
});