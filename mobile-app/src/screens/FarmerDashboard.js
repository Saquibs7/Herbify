// FarmerDashboard.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { getHarvestData, subscribeToMQTTEvents } from '../api/services'; // Example future import

const COLORS = {
  dark: '#100B00',
  mint: '#EFFFC8',
  green: '#85CB33',
  bluegreen: '#A5CBC3',
  white: '#FFFFFF',
};

// Modular blinking text component for status/ai
function BlinkingText({ children, style }) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);
  return <Animated.Text style={[style, { opacity }]}>{children}</Animated.Text>;
}

export default function FarmerDashboard() {
  const navigation = useNavigation();
  // This will later come from API/Blockchain/MQTT
  const [harvestData, setHarvestData] = useState([
    {
      id: '1',
      image: require('../assets/basil.jpg'),
      name: 'Basil',
      batchId: 'H8S1L',
      location: 'Moca, PR',
      date: '12/05/24 08:15',
      cid: 'JX-734',
      tag: 'Tag Bound',
      tagColor: COLORS.green,
      status: 'Verified',
      statusColor: COLORS.green,
      moisture: '12%',
      freshness: 'A+',
      aiSpecies: 'Basil',
      aiStatus: null,
    },
    {
      id: '2',
      image: require('../assets/rosemary.jpg'),
      name: 'Rosemary',
      batchId: 'R9T2M',
      location: 'Isabela, PR',
      date: '11/05/24 14:30',
      cid: 'JX-734',
      tag: 'No Tag',
      tagColor: '#E9B548',
      status: 'Pending',
      statusColor: '#E9B548',
      moisture: 'N/A',
      freshness: 'N/A',
      aiSpecies: null,
      aiStatus: 'Processing',
    },
  ]);

  // Placeholder for future blockchain, ML (AI), and MQTT connectivity
  useEffect(() => {
    // Example for blockchain data fetch
    // getHarvestData().then(data => setHarvestData(data));

    // Example for MQTT hardware event subscription
    // subscribeToMQTTEvents('harvest/update', (payload) => { ... });

    // Example for AI/ML service binding (e.g., image recognition)
    // callAISpeciesRecognition(image).then(result => ...);
  }, []);

  return (
    <View style={styles.background}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image style={styles.avatar} source={require('../assets/farmer-avatar.png')} />
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>Rosa</Text>
        </View>
        <View style={styles.bellContainer}>
          <View style={styles.bellIconWrap}>
            <Image source={require('../assets/bell.png')} style={styles.bellIcon} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.brandTitle}>Herbify</Text>
      <Text style={styles.subtitle}>Dashboard</Text>

      {/* Harvest Log Card */}
      <View style={styles.logCard}>
        <View style={styles.logHeaderRow}>
          <Text style={styles.sectionTitle}>Harvest Log</Text>
          <TouchableOpacity style={styles.newEntryButton} onPress={() => {/* Open new harvest entry flow */}}>
            <Text style={styles.newEntryText}>+ New Entry</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={harvestData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.harvestItem}>
              <View style={styles.cropHeader}>
                <Image source={item.image} style={styles.cropImage} />
                <View style={styles.cropInfo}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.cropName}>{item.name}</Text>
                    <View style={[styles.statusPill, { backgroundColor: item.statusColor }]}>
                      {item.status === 'Pending' ? (
                        <BlinkingText style={styles.statusPillText}>{item.status}</BlinkingText>
                      ) : (
                        <Text style={styles.statusPillText}>{item.status}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.batchId}>Batch ID: {item.batchId}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoText}>{item.location}</Text>
                    <Text style={styles.infoText}>{item.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoText}>CID: {item.cid}</Text>
                    <Text style={[styles.tag, { color: item.tagColor }]}>{item.tag}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.qualityBlock}>
                <Text style={styles.qualityTitle}>Quality Checks</Text>
                <View style={styles.qualityRow}>
                  <Text style={styles.qualityItem}>Moisture: {item.moisture}</Text>
                  <Text style={styles.qualityItem}>Freshness: {item.freshness}</Text>
                  {item.aiSpecies ? (
                    <Text style={styles.qualityItem}>AI Species: {item.aiSpecies}</Text>
                  ) : (
                    <BlinkingText style={[styles.qualityItem, { color: '#E9B548' }]}>
                      AI: {item.aiStatus}
                    </BlinkingText>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      </View>
      {/* Bottom tab nav will be added here */}
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: COLORS.dark, paddingTop: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 10, paddingHorizontal: 26 },
  avatar: { width: 60, height: 52, borderRadius: 2, marginRight: 3, marginLeft: 0 },
  welcomeText: { color: COLORS.bluegreen, fontSize: 16 },
  userName: { color: COLORS.white, fontSize: 22, fontWeight: 'bold' },
  bellContainer: { flex: 1, alignItems: 'flex-end' },
  bellIconWrap: { position: 'relative' },
  bellIcon: { width: 28, height: 28 },
  badge: { position: 'absolute', right: -5, top: -4, backgroundColor: COLORS.green, borderRadius: 12, paddingHorizontal: 5 },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  brandTitle: { color: COLORS.white, textAlign: 'center', fontSize: 30, fontWeight: 'bold', marginTop: 2, letterSpacing: 1 },
  subtitle: { color: COLORS.bluegreen, fontSize: 18, textAlign: 'center', marginBottom: 18 },
  logCard: { backgroundColor: COLORS.mint, borderTopLeftRadius: 32, borderTopRightRadius: 32, flex: 1, padding: 20 },
  logHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { color: COLORS.dark, fontSize: 22, fontWeight: 'bold' },
  newEntryButton: { backgroundColor: COLORS.green, borderRadius: 24, paddingHorizontal: 20, paddingVertical: 8 },
  newEntryText: { color: COLORS.dark, fontWeight: 'bold', fontSize: 15 },
  harvestItem: { backgroundColor: COLORS.bluegreen, borderRadius: 18, marginBottom: 18, padding: 12 },
  cropHeader: { flexDirection: 'row', marginBottom: 8 },
  cropImage: { width: 70, height: 70, borderRadius: 14, marginRight: 13 },
  cropInfo: { flex: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cropName: { color: COLORS.dark, fontSize: 19, fontWeight: '700' },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 70,  // ensures "Pending" always looks like a capsule
  },
  statusPillText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  batchId: { color: COLORS.dark, fontSize: 13, marginBottom: 3 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  infoText: { color: COLORS.dark, fontSize: 13 },
  tag: { fontWeight: 'bold' },
  qualityBlock: { marginTop: 8, borderTopWidth: 1, borderTopColor: COLORS.green, paddingTop: 7 },
  qualityTitle: { color: COLORS.dark, fontWeight: 'bold', marginBottom: 4 },
  qualityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qualityItem: { color: COLORS.dark, fontSize: 13, marginRight: 13 },
});
