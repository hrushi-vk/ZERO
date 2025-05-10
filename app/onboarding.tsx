import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAppContext, CURRENCIES } from '@/context/AppContext';
import { UserRole } from '@/types';
import { ChevronRight, DollarSign, Briefcase, GraduationCap, Users, FolderCheck, BadgeDollarSign } from 'lucide-react-native';
import theme from '@/constants/theme';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const roleOptions: { value: UserRole; label: string; icon: React.ReactNode }[] = [
  { value: 'student', label: 'Student', icon: <GraduationCap size={24} color={theme.colors.primary} /> },
  { value: 'employed', label: 'Employed', icon: <Briefcase size={24} color={theme.colors.primary} /> },
  { value: 'freelancer', label: 'Freelancer', icon: <FolderCheck size={24} color={theme.colors.primary} /> },
  { value: 'business_owner', label: 'Business Owner', icon: <BadgeDollarSign size={24} color={theme.colors.primary} /> },
  { value: 'retired', label: 'Retired', icon: <Users size={24} color={theme.colors.primary} /> },
  { value: 'other', label: 'Other', icon: <Users size={24} color={theme.colors.primary} /> },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useAppContext();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    role: '' as UserRole,
    startingBalance: '',
    currency: 'USD',
    monthlyIncomeEstimate: '',
    monthlyExpenseEstimate: '',
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Submit onboarding data
      completeOnboarding({
        name: userData.name,
        age: userData.age ? parseInt(userData.age) : undefined,
        role: userData.role || 'other',
        startingBalance: parseFloat(userData.startingBalance) || 0,
        currency: userData.currency,
        monthlyIncomeEstimate: userData.monthlyIncomeEstimate ? parseFloat(userData.monthlyIncomeEstimate) : undefined,
        monthlyExpenseEstimate: userData.monthlyExpenseEstimate ? parseFloat(userData.monthlyExpenseEstimate) : undefined,
      });
      
      // Navigate to main app
      router.replace('/(tabs)');
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !userData.name;
      case 2:
        return !userData.age;
      case 3:
        return !userData.role;
      case 4:
        return !userData.startingBalance;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
          >
            <Text style={styles.stepTitle}>What's your name?</Text>
            <Text style={styles.stepDescription}>We'll use this to personalize your experience.</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              autoFocus={Platform.OS !== 'web'}
            />
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
          >
            <Text style={styles.stepTitle}>How old are you?</Text>
            <Text style={styles.stepDescription}>This helps us provide relevant financial insights.</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              value={userData.age}
              onChangeText={(text) => {
                // Allow only numeric input
                if (/^\d*$/.test(text)) {
                  setUserData({ ...userData, age: text });
                }
              }}
              keyboardType="numeric"
              autoFocus={Platform.OS !== 'web'}
            />
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
          >
            <Text style={styles.stepTitle}>What best describes you?</Text>
            <Text style={styles.stepDescription}>Select your primary financial role.</Text>
            <ScrollView style={styles.optionsContainer}>
              {roleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    userData.role === option.value && styles.optionItemSelected,
                  ]}
                  onPress={() => setUserData({ ...userData, role: option.value })}
                >
                  <View style={styles.optionIcon}>{option.icon}</View>
                  <Text style={[
                    styles.optionText,
                    userData.role === option.value && styles.optionTextSelected,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
          >
            <Text style={styles.stepTitle}>Starting Balance</Text>
            <Text style={styles.stepDescription}>What's your current bank balance?</Text>
            
            <View style={styles.currencyContainer}>
              <View style={styles.currencySelector}>
                <Text style={styles.currencyLabel}>Currency:</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.currencyOptions}
                >
                  {CURRENCIES.map((currency) => (
                    <TouchableOpacity
                      key={currency.code}
                      style={[
                        styles.currencyOption,
                        userData.currency === currency.code && styles.currencyOptionSelected,
                      ]}
                      onPress={() => setUserData({ ...userData, currency: currency.code })}
                    >
                      <Text style={[
                        styles.currencyOptionText,
                        userData.currency === currency.code && styles.currencyOptionTextSelected,
                      ]}>
                        {currency.code} ({currency.symbol})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.balanceInputContainer}>
                <DollarSign size={20} color={theme.colors.primary} />
                <TextInput
                  style={styles.balanceInput}
                  placeholder="0.00"
                  value={userData.startingBalance}
                  onChangeText={(text) => {
                    // Allow decimal numbers
                    if (/^\d*\.?\d*$/.test(text)) {
                      setUserData({ ...userData, startingBalance: text });
                    }
                  }}
                  keyboardType="numeric"
                  autoFocus={Platform.OS !== 'web'}
                />
              </View>
            </View>
          </Animated.View>
        );
      case 5:
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
          >
            <Text style={styles.stepTitle}>Almost Done!</Text>
            <Text style={styles.stepDescription}>These optional estimates help us provide better insights.</Text>
            
            <View style={styles.estimateContainer}>
              <Text style={styles.estimateLabel}>Monthly Income (optional):</Text>
              <View style={styles.balanceInputContainer}>
                <DollarSign size={20} color={theme.colors.primary} />
                <TextInput
                  style={styles.balanceInput}
                  placeholder="0.00"
                  value={userData.monthlyIncomeEstimate}
                  onChangeText={(text) => {
                    if (/^\d*\.?\d*$/.test(text)) {
                      setUserData({ ...userData, monthlyIncomeEstimate: text });
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.estimateContainer}>
              <Text style={styles.estimateLabel}>Monthly Expenses (optional):</Text>
              <View style={styles.balanceInputContainer}>
                <DollarSign size={20} color={theme.colors.primary} />
                <TextInput
                  style={styles.balanceInput}
                  placeholder="0.00"
                  value={userData.monthlyExpenseEstimate}
                  onChangeText={(text) => {
                    if (/^\d*\.?\d*$/.test(text)) {
                      setUserData({ ...userData, monthlyExpenseEstimate: text });
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FinTrack</Text>
        <Text style={styles.subtitle}>Global Finance Tracker</Text>
      </View>
      
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View 
            key={i}
            style={[
              styles.progressDot,
              i <= step && styles.progressDotActive,
              i < step && styles.progressDotComplete,
            ]}
          />
        ))}
      </View>
      
      {renderStep()}
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, isNextDisabled() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isNextDisabled()}
        >
          <Text style={styles.nextButtonText}>
            {step === 5 ? 'Get Started' : 'Next'}
          </Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.lg,
  },
  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.size.xxxl,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.md,
    color: theme.colors.light.subtext,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.light.border,
    marginHorizontal: theme.spacing.xs,
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
    width: 12,
    height: 12,
  },
  progressDotComplete: {
    backgroundColor: theme.colors.success,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  stepTitle: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.size.xxl,
    color: theme.colors.light.text,
    marginBottom: theme.spacing.sm,
  },
  stepDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.md,
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.xl,
  },
  input: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.lg,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.light.card,
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.light.card,
  },
  optionItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.light.highlight,
  },
  optionIcon: {
    marginRight: theme.spacing.md,
  },
  optionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    color: theme.colors.light.text,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  currencyContainer: {
    marginBottom: theme.spacing.lg,
  },
  currencySelector: {
    marginBottom: theme.spacing.lg,
  },
  currencyLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    color: theme.colors.light.text,
    marginBottom: theme.spacing.sm,
  },
  currencyOptions: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
  },
  currencyOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.roundness.md,
    marginRight: theme.spacing.sm,
  },
  currencyOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.light.highlight,
  },
  currencyOptionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  currencyOptionTextSelected: {
    color: theme.colors.primary,
  },
  balanceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.light.card,
  },
  balanceInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.lg,
    marginLeft: theme.spacing.sm,
  },
  estimateContainer: {
    marginBottom: theme.spacing.lg,
  },
  estimateLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    color: theme.colors.light.text,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: theme.spacing.lg,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: theme.colors.light.border,
  },
  nextButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
    color: 'white',
    marginRight: theme.spacing.sm,
  },
});