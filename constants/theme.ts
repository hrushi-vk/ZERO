import { Platform } from 'react-native';

const palette = {
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export default {
  colors: {
    primary: palette.black,
    secondary: palette.gray[700],
    
    light: {
      background: palette.white,
      card: palette.white,
      text: palette.black,
      subtext: palette.gray[500],
      border: palette.gray[200],
      highlight: palette.gray[50],
    },
    
    dark: {
      background: palette.black,
      card: palette.gray[900],
      text: palette.white,
      subtext: palette.gray[400],
      border: palette.gray[800],
      highlight: palette.gray[800],
    },
    
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  roundness: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  typography: {
    fontFamily: {
      regular: Platform.select({
        web: 'Inter-Regular, system-ui, sans-serif',
        default: 'Inter-Regular',
      }),
      medium: Platform.select({
        web: 'Inter-Medium, system-ui, sans-serif',
        default: 'Inter-Medium',
      }),
      semibold: Platform.select({
        web: 'Inter-SemiBold, system-ui, sans-serif',
        default: 'Inter-SemiBold',
      }),
      bold: Platform.select({
        web: 'Inter-Bold, system-ui, sans-serif',
        default: 'Inter-Bold',
      }),
    },
    
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
  },
  
  shadows: {
    light: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    dark: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
      },
    },
  },
};