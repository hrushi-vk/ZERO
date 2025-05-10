import { Transaction, UserData, AIInsight } from '@/types';

export const generateAIInsights = (
  transactions: Transaction[],
  userData: UserData | null
): AIInsight[] => {
  // This is a simplified mock AI implementation that generates insights
  // In a real app, this could be connected to an actual AI service
  
  if (!userData || transactions.length < 3) {
    return [];
  }
  
  const insights: AIInsight[] = [];
  const now = new Date();
  
  // Calculate total expenses and income for the current month
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    );
  });
  
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Generate insight about expenses vs. income
  if (monthlyExpenses > 0 && monthlyIncome > 0) {
    const expenseRatio = monthlyExpenses / monthlyIncome;
    
    if (expenseRatio > 0.9) {
      insights.push({
        id: `insight-expense-ratio-${now.getTime()}`,
        type: 'alert',
        title: 'High Expense Ratio',
        description: `You're spending ${(expenseRatio * 100).toFixed(0)}% of your income this month. Consider reducing expenses to save more.`,
        date: now.toISOString(),
      });
    } else if (expenseRatio < 0.5) {
      insights.push({
        id: `insight-saving-ratio-${now.getTime()}`,
        type: 'tip',
        title: 'Great Saving Ratio',
        description: `You're saving ${((1 - expenseRatio) * 100).toFixed(0)}% of your income this month. Keep up the good work!`,
        date: now.toISOString(),
      });
    }
  }
  
  // Calculate expense categories
  const expenseCategories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
  // Find top expense category
  let topCategory = '';
  let topAmount = 0;
  
  Object.entries(expenseCategories).forEach(([category, amount]) => {
    if (amount > topAmount) {
      topCategory = category;
      topAmount = amount;
    }
  });
  
  if (topCategory && topAmount > 0) {
    insights.push({
      id: `insight-top-category-${now.getTime()}`,
      type: 'trend',
      title: 'Top Spending Category',
      description: `Your highest expense category is ${topCategory}, accounting for a significant portion of your spending.`,
      category: topCategory as any,
      value: topAmount,
      date: now.toISOString(),
    });
  }
  
  // Check for recent large expenses
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
    
  const largeExpenses = recentTransactions
    .filter(t => t.type === 'expense' && t.amount > 100);
    
  if (largeExpenses.length > 2) {
    insights.push({
      id: `insight-large-expenses-${now.getTime()}`,
      type: 'alert',
      title: 'Multiple Large Expenses',
      description: `You've had ${largeExpenses.length} large expenses recently. Review these transactions to ensure they're necessary.`,
      date: now.toISOString(),
    });
  }
  
  // Suggest setting up an emergency fund if none exists
  const hasEmergencyFund = transactions.some(
    t => t.type === 'expense' && t.category === 'savings' && t.notes?.includes('emergency')
  );
  
  if (!hasEmergencyFund) {
    insights.push({
      id: `insight-emergency-fund-${now.getTime()}`,
      type: 'recommendation',
      title: 'Set Up Emergency Fund',
      description: `Consider setting aside 3-6 months of expenses in an emergency fund for financial security.`,
      date: now.toISOString(),
    });
  }
  
  return insights.slice(0, 5); // Return top 5 insights
};