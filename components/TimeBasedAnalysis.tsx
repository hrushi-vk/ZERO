import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function TimeBasedAnalysis() {
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
  container: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
});