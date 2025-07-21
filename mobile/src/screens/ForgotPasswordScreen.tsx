import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.error('Non-JSON response:', text);
        throw new Error('Server did not return JSON.');
      }
      if (response.ok) {
        Alert.alert('Success', 'Password reset link sent to your email.');
        navigation.goBack();
      } else {
        const msg = data.message || 'Failed to send reset link.';
        Alert.alert('Error', msg);
      }
    } catch (err: any) {
      const msg = err && typeof err === 'object' && 'message' in err ? err.message : String(err);
      Alert.alert('Error', msg || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a password reset link.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>Back to Login</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
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
  backBtn: {
    marginTop: 12,
  },
  backText: {
    color: '#2563eb',
    fontWeight: '500',
    fontSize: 15,
  },
});

export default ForgotPasswordScreen; 