import React, { useState } from 'react';
import { Alert, TouchableOpacity, Text, View, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

const colors = {
  background: '#111827',
  cardBackground: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  accent: '#6EEA8E',
  primary: '#166534',
  warning: '#FCD34D',
  error: '#F87171',
  success: '#34D399',
};

async function updateShipmentStatus(scannedCode, userId) {
  console.log(`Updating shipment for code: ${scannedCode}, user: ${userId}`);
  await new Promise((res) => setTimeout(res, 1000));
  if (scannedCode.startsWith('BATCH')) {
    return { success: true };
  } else {
    return { success: false, message: 'Invalid batch code' };
  }
}

export default function TransporterDashboard() {
  const [userId] = useState('USER123');

  const scanHandler = async (scannedCode) => {
    if (!scannedCode || scannedCode.length < 3) {
      Alert.alert('Invalid scan', 'Scanned code is invalid or empty.');
      return;
    }

    try {
      const response = await updateShipmentStatus(scannedCode, userId);

      if (response.success) {
        Alert.alert('Success', 'Shipment status updated successfully!');
        // Refresh UI or fetch updated shipment data here
      } else {
        Alert.alert('Error', response.message || 'Failed to update shipment');
      }
    } catch (error) {
      Alert.alert('Error', `Scan processing failed: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.welcomeText}>Welcome, Transporter</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 24, color: colors.textSecondary }}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, styles.scanSection]}>
          <Text style={styles.scanTitle}>Scan at Point</Text>
          <View style={styles.scanButtons}>
            <TouchableOpacity style={styles.scanButton} onPress={() => scanHandler('BATCH123456')}>
              <Text style={styles.scanIcon}>📱</Text>
              <Text style={styles.scanText}>Pickup Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scanButton} onPress={() => scanHandler('XYZ987')}>
              <Text style={[styles.scanIcon, { color: colors.textSecondary }]}>📱</Text>
              <Text style={[styles.scanText, { color: colors.textSecondary }]}>Drop-off Scan</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Active Shipment: Basil #789012</Text>
        <View style={styles.card}>
          <View style={styles.conditionsRow}>
            <View style={styles.conditionCard}>
              <Text style={{ fontSize: 20, marginRight: 12 }}>🌡️</Text>
              <View>
                <Text style={styles.conditionLabel}>Temperature</Text>
                <Text style={styles.conditionValue}>21°C</Text>
              </View>
            </View>
            <View style={styles.conditionCard}>
              <Text style={{ fontSize: 20, marginRight: 12 }}>💧</Text>
              <View>
                <Text style={styles.conditionLabel}>Humidity</Text>
                <Text style={styles.conditionValue}>67%</Text>
              </View>
            </View>
          </View>

          <View style={styles.mapPlaceholder}>
            <Image
              source={require('../assets/map.jpg')}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 8 }}>
            
            </Text>
          </View>

          <View style={styles.alertContainer}>
            <Text style={{ color: colors.warning, fontSize: 20 }}>⚠️</Text>
            <View style={styles.alertText}>
              <Text style={{ color: colors.warning, fontWeight: '600' }}>Anomaly Alert</Text>
              <Text style={{ color: '#FDE68A', fontSize: 14 }}>Unscheduled stop detected at 11:45 AM.</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Provenance Trail</Text>
        <View style={styles.card}>
          <View style={styles.provenanceItem}>
            <Text style={[styles.provenanceIcon, { color: colors.accent }]}>🌱</Text>
            <View style={styles.provenanceContent}>
              <Text style={styles.provenanceTitle}>Farmer John</Text>
              <Text style={styles.provenanceSubtitle}>Harvested: Basil</Text>
              <Text style={styles.provenanceSubtitle}>June 10, 8:00 AM</Text>
            </View>
          </View>

          <View style={styles.provenanceItem}>
            <Text style={[styles.provenanceIcon, { color: colors.accent }]}>📱</Text>
            <View style={styles.provenanceContent}>
              <Text style={styles.provenanceTitle}>Pickup Scan (You)</Text>
              <Text style={styles.provenanceSubtitle}>Location: Green Farms</Text>
              <Text style={styles.provenanceSubtitle}>June 10, 9:15 AM</Text>
            </View>
          </View>

          <View style={styles.provenanceItem}>
            <Text style={[styles.provenanceIcon, { color: colors.textSecondary }]}>⋮</Text>
            <Text style={[styles.provenanceSubtitle, { fontStyle: 'italic', marginLeft: 4 }]}>
              In-transit to retailer...
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={[styles.tabIcon, styles.tabActive]}>📊</Text>
            <Text style={[styles.tabLabel, styles.tabActive]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={[styles.tabIcon, styles.tabInactive]}>🚚</Text>
            <Text style={[styles.tabLabel, styles.tabInactive]}>Shipments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={[styles.tabIcon, styles.tabInactive]}>📄</Text>
            <Text style={[styles.tabLabel, styles.tabInactive]}>Provenance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={[styles.tabIcon, styles.tabInactive]}>👤</Text>
            <Text style={[styles.tabLabel, styles.tabInactive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  scanButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  scanButton: {
    alignItems: 'center',
    padding: 16,
  },
  scanIcon: {
    fontSize: 48,
    color: colors.accent,
    marginBottom: 8,
  },
  scanText: {
    color: colors.accent,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  conditionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  conditionCard: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conditionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  conditionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  alertContainer: {
    backgroundColor: 'rgba(180, 83, 9, 0.5)',
    borderColor: '#D97706',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  alertText: {
    color: '#FCD34D',
    marginLeft: 12,
    flex: 1,
  },
  provenanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  provenanceIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  provenanceContent: {
    flex: 1,
  },
  provenanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  provenanceSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
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
    color: colors.accent,
  },
  tabInactive: {
    color: colors.textSecondary,
  },
});
