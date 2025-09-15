import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const colors = {
  background: '#F0FDF4',
  primary: '#A3FFD2',
  secondary: '#004D40',
  text: '#1A1A1A',
  border: '#E2E8F0',
  success: '#10B981',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: colors.secondary, elevation: 4,
  },
  headerButton: { padding: 8 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitleIcon: { marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  
  // Content
  content: { flex: 1, padding: 16 },

  // Title row
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  titleText: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  addButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', elevation: 3,
  },

  // Active batch card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: colors.border,
  },
  activeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  batchInfo: {},
  batchLabel: { fontSize: 16, color: colors.text },
  batchValue: { fontSize: 16, fontWeight: 'bold', color: colors.secondary },
  statusText: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  moreIcon: {},

  // Progress
  progressContainer: { marginTop: 8 },
  progressTrack: {
    height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden',
  },
  progressFill: {
    height: 8, backgroundColor: colors.secondary,
  },
  stagesRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  stageLabel: { fontSize: 12, color: '#6B7280' },
  currentStage: { color: colors.text },

  // Timeline
  timelineItem: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: colors.primary,
  },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timelineIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  timelineText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  timelineDesc: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  timelineTime: { fontSize: 12, color: '#9CA3AF' },

  // Footer Tabs
  footerTabs: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: '#FFFFFF',
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabIcon: { fontSize: 24 },
  tabLabel: { fontSize: 12, marginTop: 4 },
  tabActive: { color: colors.secondary },
  tabInactive: { color: colors.textSecondary },
});

const ProcessorDashboard = () => {
  const logItems = [
    { id: '1', icon: 'local-drink', title: '🧪 Extraction Logged', desc: 'Ethanol extraction process completed for sub-batch HB-PR-20231026-001A.', time: '🕒 Oct 27, 2023, 11:45 AM' },
    { id: '2', icon: 'call-split', title: '🔀 Batch Split', desc: 'Batch HB-PR-20231026-001 was split into two sub-batches.', time: '🕘 Oct 27, 2023, 09:00 AM' },
    { id: '3', icon: 'gavel', title: '✅ Smart Contract Validated', desc: 'Pre-transformation checks passed for Grinding stage.', time: '🕓 Oct 26, 2023, 04:10 PM' },
    { id: '4', icon: 'grain', title: '⚙️ Grinding Logged', desc: 'Batch of dried herbs ground to a fine powder.', time: '🕞 Oct 26, 2023, 03:30 PM' },
    { id: '5', icon: 'air', title: '💨 Drying Logged', desc: 'Herbs dried using industrial dehydrators. Moisture at 8%.', time: '🕚 Oct 26, 2023, 11:00 AM' },
    { id: '6', icon: 'cleaning-services', title: '🧼 Cleaning Logged', desc: 'Initial batch of raw herbs from farmer received and cleaned.', time: '🕘 Oct 26, 2023, 09:15 AM' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="menu" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="eco" size={24} color={colors.primary} style={styles.headerTitleIcon} />
          <Text style={styles.headerTitle}>Herbify</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="notifications" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Title & Add */}
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>🌿 Processor Dashboard</Text>
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Active Batch */}
        <View style={styles.card}>
          <View style={styles.activeRow}>
            <View style={styles.batchInfo}>
              <Text style={styles.batchLabel}>🔖 Active Batch: <Text style={styles.batchValue}>HB-PR-20231026-001</Text></Text>
              <Text style={styles.statusText}>🔄 Status: Grinding</Text>
            </View>
            <TouchableOpacity style={styles.moreIcon}>
              <MaterialIcons name="more-vert" size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: '75%' }]} /></View>
            <View style={styles.stagesRow}>
              <Text style={styles.stageLabel}>🧼 Cleaning</Text>
              <Text style={styles.stageLabel}>💨 Drying</Text>
              <Text style={[styles.stageLabel, styles.currentStage]}>⚙️ Grinding</Text>
              <Text style={[styles.stageLabel, { color: '#CBD5E1' }]}>🧪 Extraction</Text>
            </View>
          </View>
        </View>

        {/* Traceability Log */}
        {logItems.map(item => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineHeader}>
              <View style={styles.timelineIcon}>
                <MaterialIcons name={item.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.timelineText}>{item.title}</Text>
            </View>
            <Text style={styles.timelineDesc}>{item.desc}</Text>
            <Text style={styles.timelineTime}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer Tabs */}
      <View style={styles.footerTabs}>
        {[
          { icon: 'dashboard', label: 'Dashboard' },
          { icon: 'inventory-2', label: 'Batches' },
          { icon: 'biotech', label: 'QC' },
          { icon: 'person', label: 'Profile' }
        ].map((tab, i) => (
          <TouchableOpacity key={i} style={styles.tabItem}>
            <MaterialIcons
              name={tab.icon}
              size={24}
              color={i === 0 ? colors.secondary : colors.textSecondary}
            />
            <Text style={[styles.tabLabel, i === 0 ? styles.tabActive : styles.tabInactive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProcessorDashboard;
