import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  Alert,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const userTypes = ['Farmer', 'Transporter', 'Processor', 'Lab', 'Retailer', 'Consumer'];
  const [userType, setUserType] = useState('Farmer');
  const [phone, setPhone] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleSelectType = (type) => {
    setUserType(type);
    setDropdownVisible(false);
  };

  const handleSendOtp = () => {
    if (!phone.trim()) {
      alert('Please enter mobile number');
      return;
    }
    // TODO: Send OTP backend, blockchain, or ML service here
    setIsOtpSent(true);
  };

  const handleChangeOtp = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < inputs.current.length - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPressOtp = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

 const handleVerifyOtp = () => {
  const enteredOtp = otp.join('');
  // TODO: Verify OTP via blockchain or ML service (replace this mock)
  if (enteredOtp.length !== 6) {
    Alert.alert('Error', 'Please enter a valid 6-digit OTP');
    return;
  }
  Alert.alert('Success', 'OTP Verified Successfully!');
  if (userType === 'Farmer') {
    navigation.replace('FarmerDashboard');
  } else if (userType === 'Transporter') {
    navigation.replace('TransporterDashboard');
  }else if (userType === 'Lab') {
    navigation.replace('LabDashboard');
  } else if (userType === 'Consumer') {
    navigation.replace('ConsumerDashboard');
  } else if (userType === 'Processor') {
    navigation.replace('ProcessorDashboard');
  } 
  else {
    navigation.replace('RetailerDashboard');
  }
};

  return (
    <View style={styles.background}>
      <View style={styles.card}>
        <Image source={require('../assets/herbify-logo.png')} style={styles.logo} />
        <Text style={styles.heading}>Select Your Role</Text>
        <View style={styles.userTypeRow}>
          <View style={styles.userTypeBox}>
            <Text style={styles.userTypeText}>{userType}</Text>
          </View>
          <TouchableOpacity style={styles.changeButton} onPress={() => setDropdownVisible(true)}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>

        {!isOtpSent ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number or ID"
              placeholderTextColor="#A5CBC3"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleSendOtp}>
              <Text style={styles.primaryButtonText}>Send OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Use Digital Certificate</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.desc}>Enter the 6-digit OTP sent to +91 {phone}</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => (inputs.current[i] = ref)}
                  style={[styles.otpInput, i < otp.length - 1 && { marginRight: 10 }]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChangeOtp(text, i)}
                  onKeyPress={(e) => handleKeyPressOtp(e, i)}
                  blurOnSubmit={false}
                  autoFocus={i === 0}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOtp}>
              <Text style={styles.primaryButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.terms}>By continuing, you agree to our terms and conditions</Text>

        {/* Dropdown Modal */}
        <Modal
          visible={dropdownVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
            activeOpacity={1}
          >
            <View style={styles.dropdown}>
              <FlatList
                data={userTypes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      item === userType && styles.selectedDropdownItem,
                    ]}
                    onPress={() => handleSelectType(item)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        item === userType && styles.selectedDropdownItemText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}

const COLORS = {
  darkGreen: '#100B00',
  lightGreen: '#EFFFC8',
  brightGreen: '#85CB33',
  blueGreen: '#A5CBC3',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 30,
    padding: 28,
    width: '88%',
    elevation: 10,
    borderWidth: 5,
    borderColor: COLORS.brightGreen,
    shadowColor: COLORS.brightGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 22,
    alignItems: 'stretch',
  },
  logo: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 24,
    color: COLORS.brightGreen,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 12,
  },
  desc: {
    color: COLORS.blueGreen,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 13,
    fontWeight: '400',
  },
  userTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userTypeBox: {
    backgroundColor: COLORS.blueGreen,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexGrow: 1,
  },
  userTypeText: {
    color: COLORS.darkGreen,
    fontWeight: '700',
    fontSize: 15,
  },
  changeButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 13,
  },
  changeButtonText: {
    color: COLORS.brightGreen,
    fontWeight: '700',
  },
  input: {
    backgroundColor: 'rgba(165,203,195,0.08)',
    color: COLORS.brightGreen,
    borderRadius: 7,
    padding: 13,
    fontSize: 15,
    marginBottom: 18,
    borderWidth: 1.2,
    borderColor: COLORS.blueGreen,
  },
  primaryButton: {
    backgroundColor: COLORS.brightGreen,
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: COLORS.darkGreen,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.brightGreen,
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: COLORS.brightGreen,
    fontWeight: '700',
    fontSize: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#4CAF50',
    color: COLORS.brightGreen,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 8,
  },
  terms: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,11,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: COLORS.lightGreen,
    borderRadius: 14,
    paddingVertical: 8,
    width: 260,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedDropdownItem: {
    backgroundColor: COLORS.brightGreen,
  },
  dropdownItemText: {
    fontSize: 15,
    color: COLORS.darkGreen,
    textAlign: 'left',
    fontWeight: '500',
  },
  selectedDropdownItemText: {
    color: COLORS.lightGreen,
    fontWeight: '700',
  },
});
