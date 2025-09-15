import React from 'react';  
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';

// --- Colors ---
const colors = {
  background: '#111827',
  cardBackground: '#1F2937',
  labCardBackground: '#1A1A1A',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  accent: '#6EEA8E',
  labAccent: '#A3FFD2',
  primary: '#166534',
  labPrimary: '#004D40',
  warning: '#FCD34D',
  error: '#F87171',
  success: '#34D399',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.labAccent,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  
  // Main Content
  content: {
    flex: 1,
    padding: 16,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.labCardBackground,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.labAccent,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  
  // Lab specific styles
  labSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: colors.labPrimary,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: colors.labAccent,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  
  // Batch Item
  batchItem: {
    backgroundColor: colors.labCardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  batchIcon: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: colors.labPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  batchInfo: {
    flex: 1,
  },
  batchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  batchSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  batchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockchainText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadgePass: {
    backgroundColor: 'rgba(52, 211, 153, 0.5)',
  },
  statusBadgeFail: {
    backgroundColor: 'rgba(248, 113, 113, 0.5)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusTextPass: {
    color: '#34D399',
  },
  statusTextFail: {
    color: '#F87171',
  },
  
  // Action Alert
  actionAlert: {
    backgroundColor: 'rgba(185, 28, 28, 0.2)',
    borderColor: 'rgba(185, 28, 28, 0.5)',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 12,
  },
  actionAlertText: {
    color: '#FCA5A5',
    fontSize: 12,
  },
  
  // Tab Bar
  tabBar: {
    backgroundColor: '#000000',
    borderTopColor: '#374151',
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabActive: {
    color: colors.labAccent,
  },
  tabInactive: {
    color: colors.textSecondary,
  },
});

const LabDashboard = () => {
  const batchData = [
    {
      id: '1',
      title: 'Batch HFY-72A: Moisture Test',
      farmer: 'Ram Singh',
      icon: '💧',
      status: 'pass',
      action: null
    },
    {
      id: '2',
      title: 'Batch HFY-68B: Pesticide Analysis',
      farmer: 'Sita Devi',
      icon: '🐛',
      status: 'fail',
      action: 'Notification sent to Farmer & Manager. Batch quarantined.'
    },
    {
      id: '3',
      title: 'Batch HFY-55C: DNA Barcoding',
      farmer: 'Vijay Kumar',
      icon: '🧬',
      status: 'pass',
      action: null
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Logo Placeholder */}
          <View style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: colors.labAccent, 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginRight: 12 
            }}>
            <Text style={{ fontSize: 20, color: colors.background }}>🌿</Text>
          </View>
          <Text style={styles.headerTitle}>Herbify</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 24, color: colors.textSecondary }}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Welcome Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Lab Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome, Dr. Anya Sharma</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Batches Pending</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tests Completed</Text>
            <Text style={styles.statValue}>87</Text>
          </View>
        </View>

        {/* Batch Quality Reports */}
        <View style={styles.labSectionHeader}>
          <Text style={styles.sectionTitle}>Batch Quality Reports</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={{ color: colors.labAccent, fontSize: 16 }}>⬆️</Text>
            <Text style={styles.uploadButtonText}>Upload Report</Text>
          </TouchableOpacity>
        </View>

        {/* Batch Items */}
        {batchData.map(batch => (
          <View key={batch.id} style={styles.batchItem}>
            <View style={styles.batchHeader}>
              <View style={styles.batchIcon}>
                <Text style={{ fontSize: 20 }}>{batch.icon}</Text>
              </View>
              <View style={styles.batchInfo}>
                <Text style={styles.batchTitle}>{batch.title}</Text>
                <Text style={styles.batchSubtitle}>Farmer: {batch.farmer}</Text>
              </View>
              <TouchableOpacity>
                <Text style={{ color: colors.textSecondary, fontSize: 20 }}>⋮</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.batchFooter}>
              <Text style={styles.blockchainText}>Blockchain Validation...</Text>
              <View style={[styles.statusBadge, batch.status === 'pass' ? styles.statusBadgePass : styles.statusBadgeFail]}>
                <Text style={{ fontSize: 16 }}>{batch.status === 'pass' ? '✓' : '✗'}</Text>
                <Text style={[styles.statusText, batch.status === 'pass' ? styles.statusTextPass : styles.statusTextFail]}>
                  {batch.status === 'pass' ? 'Pass' : 'Fail'}
                </Text>
              </View>
            </View>
            
            {batch.action && (
              <View style={styles.actionAlert}>
                <Text style={styles.actionAlertText}>
                  <Text style={{ fontWeight: '600' }}>Action:</Text> {batch.action}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={[styles.tabIcon, styles.tabActive]}>📊</Text>
            <Text style={[styles.tabLabel, styles.tabActive, { fontWeight: 'bold' }]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={[styles.tabIcon, styles.tabInactive]}>🧪</Text>
            <Text style={[styles.tabLabel, styles.tabInactive]}>All Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={[styles.tabIcon, styles.tabInactive]}>📁</Text>
            <Text style={[styles.tabLabel, styles.tabInactive]}>Uploads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={[styles.tabIcon, styles.tabInactive]}>👤</Text>
            <Text style={[styles.tabLabel, styles.tabInactive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LabDashboard;
