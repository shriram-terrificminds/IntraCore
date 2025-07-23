import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import client from '../utils/client';
import OneSignal from 'react-native-onesignal';

const DUMMY_ACTIVITY = [
  { id: '1', title: 'New mouse requested', user: 'John Doe', time: '2 hours ago', status: 'pending', color: '#3b82f6' },
  { id: '2', title: 'Pantry coffee machine issue', user: 'Sarah Smith', time: '4 hours ago', status: 'resolved', color: '#f59e42' },
  { id: '3', title: 'Monitor delivered', user: 'Bob Lee', time: '1 day ago', status: 'delivered', color: '#10b981' },
];

const statusBadge = (status: string) => {
  let color = '#d1d5db';
  let text = status;
  if (status === 'pending') color = '#fbbf24';
  if (status === 'resolved') color = '#10b981';
  if (status === 'delivered') color = '#3b82f6';
  return (
    <View style={{ backgroundColor: color, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{text}</Text>
    </View>
  );
};

const DashboardScreen = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.log('[DashboardScreen] No token yet, skipping stats fetch.');
      return;
    }
    // Send OneSignal player_id to backend after login
    OneSignal.getDeviceState().then(async (deviceState) => {
      const playerId = deviceState?.userId;
      if (playerId) {
        try {
          const res = await client.post('/users/player-id', { player_id: playerId });
          console.log('[OneSignal] player_id updated:', res);
        } catch (err) {
          console.error('[OneSignal] Failed to update player_id:', err);
        }
      }
    });
    const fetchStats = async () => {
      setLoading(true);
      console.log('[DashboardScreen] Using token:', token);
      try {
        const data = await client.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const statCards = [
    { label: 'My Requests', value: stats?.my_requests ?? 0, icon: <MaterialCommunityIcons name="cube-outline" size={24} color="#3b82f6" /> },
    { label: 'My Complaints', value: stats?.my_complaints ?? 0, icon: <MaterialIcons name="chat-bubble-outline" size={24} color="#f59e42" /> },
    { label: 'Pending Requests', value: stats?.pending_requests ?? 0, icon: <MaterialIcons name="access-time" size={24} color="#f59e42" /> },
    { label: 'Pending Complaints', value: stats?.pending_complaints ?? 0, icon: <MaterialIcons name="error-outline" size={24} color="#ef4444" /> },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.welcome}>Welcome back! Here's what's happening in your office.</Text>
      <View style={{ marginTop: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          statCards.map((stat, idx) => (
          <View key={stat.label} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.cardLabel}>{stat.label}</Text>
              {stat.icon}
            </View>
            <Text style={styles.cardValue}>{stat.value}</Text>
          </View>
          ))
        )}
      </View>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <FlatList
        data={DUMMY_ACTIVITY}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color, marginRight: 8 }} />
              <View>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activitySubtitle}>{item.user} · {item.time}</Text>
              </View>
            </View>
            {statusBadge(item.status)}
          </View>
        )}
        scrollEnabled={false}
        style={{ marginTop: 8 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 28, fontWeight: 'bold', marginTop: 8 },
  welcome: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  card: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, marginTop: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2 },
  cardLabel: { fontSize: 16, fontWeight: '600', color: '#111827' },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 28, marginBottom: 8 },
  activityItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, marginBottom: 10 },
  activityTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  activitySubtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
});

export default DashboardScreen;
