import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or use '@expo/vector-icons'

const Dashboard = () => {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="menu" size={28} color="#35FFD6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Herbify</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="bell-outline" size={26} color="#35FFD6" style={{ marginRight: 8 }} />
          <View style={styles.notificationDot} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Welcome Section */}
        <Text style={styles.welcome}>Welcome, Retailer!</Text>
        {/* Metric Cards */}
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Icon name="checkbox-marked-outline" size={32} color="#35FFD6" />
            <Text style={styles.metricLabel}>Active Batches</Text>
            <Text style={styles.metricValue}>12</Text>
          </View>
          <View style={styles.metricCard}>
            <Icon name="truck-fast-outline" size={32} color="#35FFD6" />
            <Text style={styles.metricLabel}>Incoming</Text>
            <Text style={styles.metricValue}>3</Text>
          </View>
        </View>

        {/* Actions Section */}
        <Text style={styles.actionsTitle}>Actions</Text>
        <View style={styles.actionCard}>
          <Icon name="qrcode" size={30} color="#35FFD6" />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionCardTitle}>Generate Serialized Tags</Text>
            <Text style={styles.actionCardDesc}>Create unique QR codes or NFC tags for new products.</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Generate Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionCard}>
          <Icon name="link-variant" size={30} color="#35FFD6" />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionCardTitle}>Link Packaging</Text>
            <Text style={styles.actionCardDesc}>Associate packaging with full product provenance data.</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Start Linking</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionCard}>
          <Icon name="flask-outline" size={30} color="#35FFD6" />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionCardTitle}>Attach Lab Reports</Text>
            <Text style={styles.actionCardDesc}>Upload and link lab analysis reports to batches.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#444C5E' }]}>
              <Text style={styles.actionButtonText}>Upload Report</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionCard}>
          <Icon name="leaf" size={30} color="#35FFD6" />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionCardTitle}>Add Sustainability Scores</Text>
            <Text style={styles.actionCardDesc}>Update sustainability metrics for your products.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#444C5E' }]}>
              <Text style={styles.actionButtonText}>Update Score</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="view-dashboard" size={26} color="#35FFD6" />
          <Text style={styles.navTextActive}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="archive-outline" size={26} color="#BFC6D5" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="qrcode-scan" size={26} color="#BFC6D5" />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="newspaper-variant-outline" size={26} color="#BFC6D5" />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="account-circle-outline" size={26} color="#BFC6D5" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#161B24' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#161B24',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#35FFD6',
    letterSpacing: 1,
  },
  notificationDot: {
    width: 10,
    height: 10,
    backgroundColor: '#ff5252',
    borderRadius: 5,
    position: 'absolute',
    top: -5,
    right: 0,
  },
  welcome: {
    color: '#BFC6D5',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
    marginLeft: 16,
  },
  metricCard: {
    backgroundColor: '#202534',
    borderRadius: 16,
    padding: 30,
    width: 150,
    alignItems: 'center',
    marginRight: 20,
    marginLeft:15,
    elevation: 2,
  },
  metricLabel: {
    color: '#BFC6D5',
    marginTop: 8,
    fontSize: 16,
  },
  metricValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 5,
  },
  actionsTitle: {
    color: '#7FFFD4',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 8,
    marginLeft: 20,
  },
  actionCard: {
    backgroundColor: '#202534',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 18,
    gap: 18,
  },
  actionCardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  actionCardDesc: {
    color: '#BFC6D5',
    marginBottom: 10,
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#1ED187',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  actionButtonText: {
    color: '#202534',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#202534',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#23283A',
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingBottom:20,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { color: '#BFC6D5', fontSize: 10, marginTop: 3 },
  navTextActive: { color: '#35FFD6', fontWeight: 'bold', fontSize: 10, marginTop: 3,marginLeft:2 },
});

export default Dashboard;
