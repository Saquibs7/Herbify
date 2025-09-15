import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Platform, StatusBar } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    setHasPermission(Boolean(permission?.granted));
  }, [permission]);

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert('QR Code Scanned', data, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Camera permission is required to scan QR codes.</Text>
        <Button title="Request Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' ? <StatusBar hidden /> : null}
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: 'qr' }}
        onBarcodeScanned={handleBarCodeScanned}
      />
      <Text style={styles.instructions}>Point the camera at a QR code</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { width: '100%', height: '80%' },
  instructions: { textAlign: 'center', marginTop: 10, fontSize: 16 },
});
