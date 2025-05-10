import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import theme from '@/constants/theme';
import { Wallet, TrendingUp, TrendingDown, History, ChartPie as PieChart } from 'lucide-react-native';

const CircularTab = ({ 
  label, 
  isActive, 
  onPress,
  icon: Icon 
}: { 
  label: string; 
  isActive: boolean;
  onPress: () => void;
  icon: any;
}) => (
  <TouchableOpacity 
    style={[styles.circularTabContainer, isActive && styles.circularTabContainerActive]} 
    onPress={onPress}
  >
    <Icon size={20} color={isActive ? theme.colors.primary : theme.colors.light.subtext} />
    <Text style={[styles.circularTabText, isActive && styles.circularTabTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function TabLayout() {
  const { isDarkMode } = useAppContext();
  const router = useRouter();
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDarkMode ? theme.colors.dark.background : theme.colors.light.background }
    ]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="income" />
        <Tabs.Screen name="expenses" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="insights" />
      </Tabs>

      {/* Top Navigation */}
      <View style={[
        styles.topNav,
        { borderBottomColor: isDarkMode ? theme.colors.dark.border : theme.colors.light.border }
      ]}>
        <View style={styles.statusBarSpace} />
        
        <View style={styles.navContent}>
          <Text style={[
            styles.appTitle,
            { color: isDarkMode ? theme.colors.dark.text : theme.colors.light.text }
          ]}>
            FinTrack
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            <CircularTab
              label="Overview"
              icon={Wallet}
              isActive={true}
              onPress={() => router.push('/(tabs)/')}
            />
            <CircularTab
              label="Income"
              icon={TrendingUp}
              isActive={false}
              onPress={() => router.push('/(tabs)/income')}
            />
            <CircularTab
              label="Expenses"
              icon={TrendingDown}
              isActive={false}
              onPress={() => router.push('/(tabs)/expenses')}
            />
            <CircularTab
              label="History"
              icon={History}
              isActive={false}
              onPress={() => router.push('/(tabs)/history')}
            />
            <CircularTab
              label="Insights"
              icon={PieChart}
              isActive={false}
              onPress={() => router.push('/(tabs)/insights')}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  statusBarSpace: {
    height: Platform.OS === 'ios' ? 50 : 40,
  },
  navContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  appTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xl,
    marginBottom: theme.spacing.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingRight: theme.spacing.xl,
  },
  circularTabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.roundness.full,
    marginRight: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  circularTabContainerActive: {
    backgroundColor: theme.colors.light.highlight,
  },
  circularTabText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.light.subtext,
    marginLeft: theme.spacing.xs,
  },
  circularTabTextActive: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});