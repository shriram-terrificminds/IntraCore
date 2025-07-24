// src/navigation/index.tsx
import React from 'react';
import { Button, View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RequestsList from '../screens/RequestsList';
import RequestForm from '../screens/RequestForm';
import RequestDetail from '../screens/RequestDetail';
import ComplaintsList from '../screens/ComplaintsList';
import ComplaintForm from '../screens/ComplaintForm';
import ComplaintDetail from '../screens/ComplaintDetail';
import ProfileScreen from '../screens/ProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from './types';
// import type { RootStackParamList } from './types';

const AuthStackNav    = createNativeStackNavigator<RootStackParamList>();
const AppTab          = createBottomTabNavigator<RootStackParamList>();
const RequestsStack   = createNativeStackNavigator<RootStackParamList>();
const ComplaintsStack = createNativeStackNavigator<RootStackParamList>();

function RequestsStackScreen() {
  return (
    <RequestsStack.Navigator screenOptions={{ headerShown: false }}>
      <RequestsStack.Screen name="RequestsList" component={RequestsList} options={{ title: 'Requests' }} />
      <RequestsStack.Screen name="RequestForm"   component={RequestForm}   options={{ title: 'New Request' }} />
      <RequestsStack.Screen name="RequestDetail" component={RequestDetail} options={{ title: 'Request Detail' }} />
    </RequestsStack.Navigator>
  );
}

function ComplaintsStackScreen() {
  return (
    <ComplaintsStack.Navigator screenOptions={{ headerShown: false }}>
      <ComplaintsStack.Screen name="ComplaintsList"   component={ComplaintsList}   options={{ title: 'Complaints' }} />
      <ComplaintsStack.Screen name="ComplaintForm"    component={ComplaintForm}    options={{ title: 'New Complaint' }} />
      <ComplaintsStack.Screen name="ComplaintDetail"  component={ComplaintDetail}  options={{ title: 'Complaint Detail' }} />
    </ComplaintsStack.Navigator>
  );
}

export default function Navigation() {
  const { token, loading, signOut } = useAuth();
  const isAuthenticated = Boolean(token);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? (
    <AppTab.Navigator>
      <AppTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" color={color} size={size} />,
        }}
      />
      <AppTab.Screen name="Inventory" component={RequestsStackScreen} options={{ title: 'Inventory', headerShown: false, tabBarIcon: ({ color, size }) => <MaterialIcons name="inventory" color={color} size={size} /> }} />
      <AppTab.Screen name="ComplaintsList" component={ComplaintsStackScreen} options={{ title: 'Complaints', headerShown: false, tabBarIcon: ({ color, size }) => <MaterialIcons name="chat-bubble-outline" color={color} size={size} /> }} />
      <AppTab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile', headerShown: false, tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} /> }} />
    </AppTab.Navigator>
  ) : (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStackNav.Navigator>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
