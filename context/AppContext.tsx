import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, Transaction, Goal, Currency } from '@/types';

// Default currencies supported
export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

type AppContextType = {
  isOnboarded: boolean;
  userData: UserData | null;
  transactions: Transaction[];
  goals: Goal[];
  completeOnboarding: (data: UserData) => void;
  addTransaction: (transaction: Transaction) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, goalData: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  updateUserData: (data: Partial<UserData>) => void;
  deleteTransaction: (id: string) => void;
  currentBalance: number;
  resetAllData: () => void;
  getSelectedCurrency: () => Currency;
  changeCurrency: (currencyCode: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const defaultContext: AppContextType = {
  isOnboarded: false,
  userData: null,
  transactions: [],
  goals: [],
  completeOnboarding: () => {},
  addTransaction: () => {},
  addGoal: () => {},
  updateGoal: () => {},
  deleteGoal: () => {},
  updateUserData: () => {},
  deleteTransaction: () => {},
  currentBalance: 0,
  resetAllData: () => {},
  getSelectedCurrency: () => CURRENCIES[0],
  changeCurrency: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const onboardedStatus = await AsyncStorage.getItem('isOnboarded');
        setIsOnboarded(onboardedStatus === 'true');
        
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
        
        const storedTransactions = await AsyncStorage.getItem('transactions');
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
        
        const storedGoals = await AsyncStorage.getItem('goals');
        if (storedGoals) {
          setGoals(JSON.parse(storedGoals));
        }

        const darkModeStatus = await AsyncStorage.getItem('isDarkMode');
        setIsDarkMode(darkModeStatus === 'true');
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    
    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('isOnboarded', isOnboarded.toString());
        if (userData) {
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        }
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
        await AsyncStorage.setItem('goals', JSON.stringify(goals));
        await AsyncStorage.setItem('isDarkMode', isDarkMode.toString());
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };
    
    saveData();
  }, [isOnboarded, userData, transactions, goals, isDarkMode]);

  // Complete onboarding and set user data
  const completeOnboarding = (data: UserData) => {
    setUserData(data);
    setIsOnboarded(true);
  };

  // Add new transaction
  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  // Delete transaction
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // Add new goal
  const addGoal = (goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  };

  // Update existing goal
  const updateGoal = (goalId: string, goalData: Partial<Goal>) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, ...goalData } : goal
      )
    );
  };

  // Delete goal
  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  // Update user data
  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...data } : null);
  };

  // Get current balance
  const currentBalance = (() => {
    if (!userData) return 0;
    
    const startingBalance = userData.startingBalance || 0;
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return startingBalance + totalIncome - totalExpenses;
  })();

  // Reset all data
  const resetAllData = async () => {
    try {
      await AsyncStorage.multiRemove([
        'isOnboarded', 
        'userData', 
        'transactions', 
        'goals'
      ]);
      setIsOnboarded(false);
      setUserData(null);
      setTransactions([]);
      setGoals([]);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  // Get selected currency
  const getSelectedCurrency = (): Currency => {
    if (!userData || !userData.currency) {
      return CURRENCIES[0]; // Default to USD
    }
    
    const userCurrency = CURRENCIES.find(c => c.code === userData.currency);
    return userCurrency || CURRENCIES[0];
  };

  // Change currency
  const changeCurrency = (currencyCode: string) => {
    if (userData) {
      updateUserData({ currency: currencyCode });
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isOnboarded,
    userData,
    transactions,
    goals,
    completeOnboarding,
    addTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    updateUserData,
    deleteTransaction,
    currentBalance,
    resetAllData,
    getSelectedCurrency,
    changeCurrency,
    isDarkMode,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};