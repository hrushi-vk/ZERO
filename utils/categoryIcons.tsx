import React from 'react';
import {
  Utensils,
  Home,
  Car,
  Lightbulb,
  Heart,
  Film,
  ShoppingBag,
  GraduationCap,
  Plane,
  User,
  CreditCard,
  PiggyBank,
  Gift,
  HelpCircle,
  Briefcase,
  Laptop,
  Building,
  Banknote,
  ArrowDownCircle,
  ThumbsUp,
} from 'lucide-react-native';
import theme from '@/constants/theme';

export const getCategoryIcon = (category: string, type: 'income' | 'expense') => {
  const color = type === 'income' ? theme.colors.success : theme.colors.error;
  const size = 20;

  // Expense categories
  if (type === 'expense') {
    switch (category) {
      case 'food':
        return <Utensils size={size} color={color} />;
      case 'housing':
        return <Home size={size} color={color} />;
      case 'transportation':
        return <Car size={size} color={color} />;
      case 'utilities':
        return <Lightbulb size={size} color={color} />;
      case 'healthcare':
        return <Heart size={size} color={color} />;
      case 'entertainment':
        return <Film size={size} color={color} />;
      case 'shopping':
        return <ShoppingBag size={size} color={color} />;
      case 'education':
        return <GraduationCap size={size} color={color} />;
      case 'travel':
        return <Plane size={size} color={color} />;
      case 'personal':
        return <User size={size} color={color} />;
      case 'debt':
        return <CreditCard size={size} color={color} />;
      case 'savings':
        return <PiggyBank size={size} color={color} />;
      case 'gifts':
        return <Gift size={size} color={color} />;
      default:
        return <HelpCircle size={size} color={color} />;
    }
  }
  
  // Income categories
  switch (category) {
    case 'salary':
      return <Briefcase size={size} color={color} />;
    case 'freelance':
      return <Laptop size={size} color={color} />;
    case 'business':
      return <Building size={size} color={color} />;
    case 'investments':
      return <PiggyBank size={size} color={color} />;
    case 'gifts':
      return <Gift size={size} color={color} />;
    case 'refunds':
      return <ArrowDownCircle size={size} color={color} />;
    default:
      return <Banknote size={size} color={color} />;
  }
};