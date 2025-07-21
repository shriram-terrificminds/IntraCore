// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import type { StackNavigationProp } from '@react-navigation/stack';

type LoginNavProp = StackNavigationProp<any, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    console.log('Attempting login with:', { email, password, remember });
    try {
      await signIn(email, password, remember);
      Alert.alert('Success', 'Login successful!');
      navigation.replace('Dashboard');
    } catch (e: any) {
      const msg = e && typeof e === 'object' && 'message' in e ? e.message : String(e);
      setError(msg || 'Login failed');
      console.error('Login failed:', e);
      Alert.alert('Login Failed', msg || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.rememberRow}>
        <Switch value={remember} onValueChange={setRemember} />
        <Text style={{ marginLeft: 8 }}>Remember Me</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotBtn}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1e293b',
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  error: {
    color: '#ef4444',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  forgotBtn: {
    marginTop: 16,
  },
  forgotText: {
    color: '#2563eb',
    fontWeight: '500',
    fontSize: 15,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
