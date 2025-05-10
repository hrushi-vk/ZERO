// User role options
export type UserRole = 'student' | 'employed' | 'freelancer' | 'business_owner' | 'retired' | 'other';

// User data interface
export interface UserData {
  name: string;
  age?: number;
  role: UserRole;
  startingBalance: number;
  currency: string;
  monthlyIncomeEstimate?: number;
  monthlyExpenseEstimate?: number;
}

// Transaction categories
export type ExpenseCategory = 
  | 'food' 
  | 'housing' 
  | 'transportation' 
  | 'utilities' 
  | 'healthcare' 
  | 'entertainment' 
  | 'shopping' 
  | 'education' 
  | 'travel' 
  | 'personal' 
  | 'debt' 
  | 'savings' 
  | 'gifts' 
  | 'other';

export type IncomeCategory = 
  | 'salary' 
  | 'freelance' 
  | 'business' 
  | 'investments' 
  | 'gifts' 
  | 'refunds' 
  | 'other';

// Transaction interface
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: IncomeCategory | ExpenseCategory;
  notes?: string;
  tags?: string[];
  paymentMethod?: string; // For expenses only
}

// Goal categories
export type GoalCategory = 
  | 'savings' 
  | 'debt_repayment' 
  | 'emergency_fund' 
  | 'travel' 
  | 'education' 
  | 'retirement' 
  | 'home' 
  | 'vehicle' 
  | 'gadget' 
  | 'other';

// Goal interface
export interface Goal {
  id: string;
  name: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate?: string; // Optional deadline
  notes?: string;
  color?: string; // For UI customization
}

// Currency interface
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// Theme types
export type ThemeType = 'light' | 'dark';

// AI Insight interface
export interface AIInsight {
  id: string;
  type: 'tip' | 'alert' | 'trend' | 'recommendation';
  title: string;
  description: string;
  category?: ExpenseCategory | IncomeCategory;
  value?: number;
  date: string; // When the insight was generated
}