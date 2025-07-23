import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import client from '../utils/client';

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await client.get('/auth/user');
        setUser(data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  if (!user) return <Text style={{ margin: 16 }}>Failed to load profile.</Text>;

  return (
    <View style={styles.bgContainer}>
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.avatarShadow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.first_name?.[0]}{user.last_name?.[0]}</Text>
            </View>
          </View>
          <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{user.role?.name || '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{user.location?.name || '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>{user.created_at ? user.created_at.split('T')[0] : '-'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bgContainer: { flex: 1, backgroundColor: '#e0e7ff' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  profileCard: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', width: '100%', maxWidth: 360, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 36 },
  avatarShadow: { shadowColor: '#2563eb', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, marginBottom: 18 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 38 },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 2, color: '#1e293b', letterSpacing: 0.5 },
  email: { fontSize: 17, color: '#64748b', marginBottom: 18 },
  divider: { height: 1, backgroundColor: '#e5e7eb', width: '100%', marginVertical: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 2 },
  infoLabel: { color: '#64748b', fontWeight: 'bold', fontSize: 16 },
  infoValue: { color: '#334155', fontSize: 16, fontWeight: '600' },
  logoutBtn: { width: '100%', maxWidth: 360, borderRadius: 10, backgroundColor: '#ef4444', alignItems: 'center', paddingVertical: 16, marginTop: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 },
});

export default ProfileScreen; 