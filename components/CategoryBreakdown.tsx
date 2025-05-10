import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export default function CategoryBreakdown() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      <PieChart
        data={[
          { name: 'Food', amount: 8000, color: '#f39c12', legendFontColor: '#000', legendFontSize: 12 },
          { name: 'Travel', amount: 5000, color: '#3498db', legendFontColor: '#000', legendFontSize: 12 },
          { name: 'Utilities', amount: 3000, color: '#2ecc71', legendFontColor: '#000', legendFontSize: 12 },
        ]}
        width={300}
        height={200}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <Text style={styles.sectionTitle}>Top 3 Categories</Text>
      <View>
        <Text>1. Dining Out: Increased by ₹1,200</Text>
        <Text>2. Travel: Stable</Text>
        <Text>3. Utilities: Stable</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
});