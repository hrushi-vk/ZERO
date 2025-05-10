import React from 'react';
import { ScrollView } from 'react-native';
import SmartSummary from '../components/SmartSummary';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TimeBasedAnalysis from '../components/TimeBasedAnalysis';

export default function InsightsPage() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <SmartSummary />
      <CategoryBreakdown />
      <TimeBasedAnalysis />
    </ScrollView>
  );
}