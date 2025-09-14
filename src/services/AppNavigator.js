import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import FarmerDashboard from '../screens/FarmerDashboard'; 
import TransporterDashboard from '../screens/TransporterDashboard'; 
import LabDashboard from '../screens/LabDashboard';
import ConsumerDashboard from '../screens/ConsumerDashboard';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="FarmerDashboard" component={FarmerDashboard} />
      <Stack.Screen name="TransporterDashboard" component={TransporterDashboard} />
      <Stack.Screen name="LabDashboard" component={LabDashboard} />
      <Stack.Screen name="ConsumerDashboard" component={ConsumerDashboard} />
    </Stack.Navigator>
  );
}
