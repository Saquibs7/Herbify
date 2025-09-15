import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StyleSheet
} from 'react-native';

// --- Colors ---
const colors = {
  background: '#111714',
  cardBackground: '#1C2620',
  text: '#F9FAFB',
  textSecondary: '#9eb7a8',
  accent: '#1dc962',
  border: '#29382f',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  headerSpacer: { width: 48 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Search Bar
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    height: 48,
  },
  searchIcon: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 16,
  },
  
  // Content
  content: {
    flex: 1,
    paddingBottom: 90, // Space for tab bar
  },
  
  // Section Headers
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  
  // Scan Section
  scanCard: {
    marginHorizontal: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scanImageContainer: {
    height: 200,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanImagePlaceholder: {
    fontSize: 48,
    color: '#6B7280',
  },
  scanContent: {
    padding: 16,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  scanDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
  
  // Recent Scans
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  scanItemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanItemImagePlaceholder: {
    fontSize: 24,
  },
  scanItemContent: {
    flex: 1,
  },
  scanItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  scanItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scanItemChevron: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  
  // Tab Bar
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

const ConsumerDashboard = () => {
  const recentScans = [
    { id: '1', title: 'Organic Mint Tea', subtitle: 'Verified: 2 days ago', icon: '🍃' },
    { id: '2', title: 'Fair Trade Coffee Beans', subtitle: 'Verified: 1 week ago', icon: '☕' },
    { id: '3', title: 'Sustainable Salmon', subtitle: 'Verified: 3 weeks ago', icon: '🐟' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Herbify</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={{ fontSize: 24, color: colors.textSecondary }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <View style={styles.searchIcon}>
            <Text style={{ fontSize: 20, color: colors.textSecondary }}>🔍</Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scan & Verify Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Scan & Verify</Text>
        </View>

        <View style={styles.scanCard}>
          <View style={styles.scanImageContainer}>
            <Text style={styles.scanImagePlaceholder}>📦</Text>
          </View>
          <View style={styles.scanContent}>
            <Text style={styles.scanTitle}>Scan Product</Text>
            <Text style={styles.scanDescription}>
              Use your camera to scan QR codes or NFC tags on products to verify their authenticity and journey.
            </Text>
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.scanButtonText}>Scan Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Scans Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
        </View>

        <View>
          {recentScans.map(item => (
            <TouchableOpacity key={item.id} style={styles.scanItem}>
              <View style={styles.scanItemImage}>
                <Text style={styles.scanItemImagePlaceholder}>{item.icon}</Text>
              </View>
              <View style={styles.scanItemContent}>
                <Text style={styles.scanItemTitle}>{item.title}</Text>
                <Text style={styles.scanItemSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.scanItemChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabIcon, styles.tabActive]}>🏠</Text>
          <Text style={[styles.tabLabel, styles.tabActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabIcon, styles.tabInactive]}>📱</Text>
          <Text style={[styles.tabLabel, styles.tabInactive]}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabIcon, styles.tabInactive]}>📜</Text>
          <Text style={[styles.tabLabel, styles.tabInactive]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabIcon, styles.tabInactive]}>👤</Text>
          <Text style={[styles.tabLabel, styles.tabInactive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConsumerDashboard;
