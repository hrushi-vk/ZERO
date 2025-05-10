import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Modal } from 'react-native';
import theme from '@/constants/theme';
import { useAppContext, CURRENCIES } from '@/context/AppContext';
import { Moon, Sun, DollarSign, Github, Globe, Mail, FileText, User, LogOut, AlertTriangle } from 'lucide-react-native';

export default function SettingsScreen() {
  const { 
    userData, 
    isDarkMode, 
    toggleDarkMode, 
    getSelectedCurrency, 
    changeCurrency, 
    resetAllData 
  } = useAppContext();
  
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [resetConfirmModalVisible, setResetConfirmModalVisible] = useState(false);
  
  const activeTheme = isDarkMode ? theme.colors.dark : theme.colors.light;
  const selectedCurrency = getSelectedCurrency();
  
  const handleResetData = () => {
    resetAllData();
    setResetConfirmModalVisible(false);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.settingsList}>
        {/* User Info Section */}
        <View style={[styles.settingsSection, { backgroundColor: activeTheme.card }]}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <User size={30} color={theme.colors.primary} />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: activeTheme.text }]}>{userData?.name || 'User'}</Text>
              <Text style={[styles.userRole, { color: activeTheme.subtext }]}>
                {userData?.role ? userData.role.replace('_', ' ') : 'User'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Appearance Section */}
        <Text style={[styles.sectionLabel, { color: activeTheme.subtext }]}>Appearance</Text>
        <View style={[styles.settingsSection, { backgroundColor: activeTheme.card }]}>
          <TouchableOpacity style={styles.settingsItem} onPress={toggleDarkMode}>
            <View style={styles.settingIconContainer}>
              {isDarkMode ? (
                <Moon size={24} color={theme.colors.primary} />
              ) : (
                <Sun size={24} color={theme.colors.primary} />
              )}
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: activeTheme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: activeTheme.subtext }]}>
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
            />
          </TouchableOpacity>
        </View>
        
        {/* Preferences Section */}
        <Text style={[styles.sectionLabel, { color: activeTheme.subtext }]}>Preferences</Text>
        <View style={[styles.settingsSection, { backgroundColor: activeTheme.card }]}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => setCurrencyModalVisible(true)}
          >
            <View style={styles.settingIconContainer}>
              <DollarSign size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: activeTheme.text }]}>Currency</Text>
              <Text style={[styles.settingDescription, { color: activeTheme.subtext }]}>
                {selectedCurrency.code} ({selectedCurrency.symbol})
              </Text>
            </View>
            <Text style={styles.settingAction}>Change</Text>
          </TouchableOpacity>
        </View>
        
        {/* Help & Support Section */}
        <Text style={[styles.sectionLabel, { color: activeTheme.subtext }]}>Help & Support</Text>
        <View style={[styles.settingsSection, { backgroundColor: activeTheme.card }]}>
          <TouchableOpacity 
            style={styles.settingsItem}
          >
            <View style={styles.settingIconContainer}>
              <Globe size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: activeTheme.text }]}>Website</Text>
              <Text style={[styles.settingDescription, { color: activeTheme.subtext }]}>
                Visit our website
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.settingsItem}
          >
            <View style={styles.settingIconContainer}>
              <Mail size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: activeTheme.text }]}>Contact Support</Text>
              <Text style={[styles.settingDescription, { color: activeTheme.subtext }]}>
                Get help with the app
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.settingsItem}
          >
            <View style={styles.settingIconContainer}>
              <FileText size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: activeTheme.text }]}>Privacy Policy</Text>
              <Text style={[styles.settingDescription, { color: activeTheme.subtext }]}>
                Read our privacy policy
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* About Section */}
        <Text style={[styles.sectionLabel, { color: activeTheme.subtext }]}>About</Text>
        <View style={[styles.settingsSection, { backgroundColor: activeTheme.card }]}>
          <TouchableOpacity 
            style={styles.settingsItem}
          >
            <View style={styles.settingIconContainer}>
              <Github size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: activeTheme.text }]}>Version</Text>
              <Text style={[styles.settingDescription, { color: activeTheme.subtext }]}>
                1.0.0
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Data Management Section */}
        <Text style={[styles.sectionLabel, { color: activeTheme.subtext }]}>Data</Text>
        <View style={[styles.settingsSection, { backgroundColor: activeTheme.card }]}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => setResetConfirmModalVisible(true)}
          >
            <View style={styles.settingIconContainer}>
              <LogOut size={24} color={theme.colors.error} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.colors.error }]}>Reset All Data</Text>
              <Text style={[styles.settingDescription, { color: activeTheme.subtext }]}>
                This will delete all your data
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* App Version */}
        <Text style={[styles.appVersion, { color: activeTheme.subtext }]}>
          FinTrack © 2025
        </Text>
      </ScrollView>
      
      {/* Currency Modal */}
      <Modal
        visible={currencyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeTheme.background }]}>
            <Text style={[styles.modalTitle, { color: activeTheme.text }]}>Select Currency</Text>
            
            <ScrollView style={styles.currencyList}>
              {CURRENCIES.map(currency => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyItem,
                    selectedCurrency.code === currency.code && [
                      styles.currencyItemSelected,
                      { backgroundColor: 'rgba(139, 92, 246, 0.1)' }
                    ],
                  ]}
                  onPress={() => {
                    changeCurrency(currency.code);
                    setCurrencyModalVisible(false);
                  }}
                >
                  <Text style={[styles.currencySymbol, { color: activeTheme.text }]}>
                    {currency.symbol}
                  </Text>
                  <View style={styles.currencyDetails}>
                    <Text style={[styles.currencyCode, { color: activeTheme.text }]}>
                      {currency.code}
                    </Text>
                    <Text style={[styles.currencyName, { color: activeTheme.subtext }]}>
                      {currency.name}
                    </Text>
                  </View>
                  {selectedCurrency.code === currency.code && (
                    <View style={styles.selectedIndicator}>
                      <DollarSign size={16} color={theme.colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCurrencyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Reset Confirm Modal */}
      <Modal
        visible={resetConfirmModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setResetConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeTheme.background }]}>
            <View style={styles.resetWarningContainer}>
              <AlertTriangle size={48} color={theme.colors.error} />
            </View>
            
            <Text style={[styles.resetTitle, { color: theme.colors.error }]}>Reset All Data?</Text>
            <Text style={[styles.resetDescription, { color: activeTheme.text }]}>
              This action cannot be undone. All your transactions, goals, and settings will be permanently deleted.
            </Text>
            
            <View style={styles.resetButtonsContainer}>
              <TouchableOpacity
                style={[styles.resetButton, styles.cancelButton]}
                onPress={() => setResetConfirmModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.resetButton, styles.confirmButton]}
                onPress={handleResetData}
              >
                <Text style={styles.confirmButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
  },
  settingsList: {
    flex: 1,
  },
  sectionLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    marginLeft: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  settingsSection: {
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.roundness.md,
    overflow: 'hidden',
    ...theme.shadows.light.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
  },
  settingDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
  },
  settingAction: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginLeft: 60,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.lg,
  },
  userRole: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.md,
    textTransform: 'capitalize',
  },
  appVersion: {
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    padding: theme.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: theme.roundness.lg,
    borderTopRightRadius: theme.roundness.lg,
    padding: theme.spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xl,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  currencyList: {
    maxHeight: 400,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.sm,
  },
  currencyItemSelected: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  currencySymbol: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xl,
    width: 40,
    textAlign: 'center',
  },
  currencyDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  currencyCode: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.md,
  },
  currencyName: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  closeButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: 'white',
  },
  resetWarningContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  resetTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xl,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  resetDescription: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  resetButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton: {
    flex: 0.48,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  confirmButton: {
    backgroundColor: theme.colors.error,
  },
  cancelButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: '#000',
  },
  confirmButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.md,
    color: 'white',
  },
});