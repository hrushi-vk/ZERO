import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen
            name="onboarding"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="insights"
            options={{
              animation: 'fade',
              title: 'Insights',
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </AuthProvider>
  );
}

export function TimeBasedAnalysis() {
  console.log('TimeBasedAnalysis rendered'); // Debugging log
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Daily & Weekly Patterns</Text>
      <Text>Heatmap coming soon...</Text>
      <Text style={styles.sectionTitle}>Calendar View</Text>
      <Calendar
        markedDates={{
          '2023-05-01': { marked: true, dotColor: 'red' },
          '2023-05-15': { marked: true, dotColor: 'green' },
        }}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: 'orange',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

