import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import client from '../utils/client';

const FILTERS = ['All Requests', 'Pending', 'Approved', 'Delivered'];

const statusStyles = {
  Pending: { color: '#b59f00', bg: '#fef9c3', icon: 'access-time' },
  Approved: { color: '#2563eb', bg: '#dbeafe', icon: 'check-circle-outline' },
  Delivered: { color: '#059669', bg: '#d1fae5', icon: 'cube-outline' },
};

const RequestsList = () => {
  const [filter, setFilter] = useState('All Requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchRequests = async () => {
        setLoading(true);
        try {
          const data = await client.post('/inventory-requests/list', { search: '' });
          setRequests(data.data || []);
        } catch (err) {
          console.error('Failed to fetch requests:', err);
          setRequests([]);
        } finally {
          setLoading(false);
        }
      };
      fetchRequests();
    }, [])
  );

  const filtered: any[] =
    filter === 'All Requests'
      ? requests
      : requests.filter(r => r.status === filter);

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Inventory Requests</Text>
          <Text style={styles.subtitle}>Manage office equipment and supply requests</Text>
        </View>
        <TouchableOpacity style={styles.newRequestBtn} onPress={() => (navigation as any).navigate('RequestForm')}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.newRequestText}>New Request</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }: { item: any }) => {
            const status = statusStyles[item.status as keyof typeof statusStyles];
            return (
              <TouchableOpacity onPress={() => (navigation as any).navigate('RequestDetail', { id: item.id })} activeOpacity={0.85} style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: status?.bg }]}> 
                    <MaterialIcons name={status?.icon} size={16} color={status?.color} style={{ marginRight: 2 }} />
                    <Text style={{ color: status?.color, fontWeight: 'bold', fontSize: 13 }}>{item.status}</Text>
                  </View>
                  <View style={styles.priorityBadge}><Text style={styles.priorityText}>{item.priority || '-'}</Text></View>
                  <View style={styles.locationBadge}>
                    <MaterialIcons name="location-on" size={15} color="#64748b" style={{ marginRight: 2 }} />
                    <Text style={styles.locationText}>{item.location || '-'}</Text>
                  </View>
                </View>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <View style={styles.cardDetailsRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardDetailsLabel}>Requested by:</Text>
                    <Text style={styles.cardDetailsValue}>{item.requestedBy || '-'}</Text>
                    <Text style={styles.cardDetailsLabel}>Category:</Text>
                    <Text style={styles.cardDetailsValue}>{item.category || '-'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardDetailsLabel}>Department:</Text>
                    <Text style={styles.cardDetailsValue}>{item.department || '-'}</Text>
                    <Text style={styles.cardDetailsLabel}>Date:</Text>
                    <Text style={styles.cardDetailsValue}>{item.date || '-'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 32 }}
          style={{ marginTop: 8 }}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32, color: '#64748b' }}>No requests found.</Text>}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'stretch', padding: 20, paddingBottom: 0 },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 2 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 8 },
  newRequestBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 0, height: 48, alignSelf: 'flex-start', marginLeft: 12, justifyContent: 'center' },
  newRequestText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 4 },
  filterRow: { flexDirection: 'row', marginTop: 16, marginBottom: 8 },
  filterBtn: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#f3f4f6', marginRight: 8 },
  filterBtnActive: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#111827' },
  filterText: { color: '#64748b', fontWeight: 'bold', fontSize: 15 },
  filterTextActive: { color: '#111827' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginHorizontal: 16, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  priorityBadge: { backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  priorityText: { color: '#334155', fontWeight: 'bold', fontSize: 13 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  locationText: { color: '#334155', fontWeight: 'bold', fontSize: 13 },
  cardDesc: { color: '#64748b', fontSize: 15, marginTop: 4, marginBottom: 10 },
  cardDetailsRow: { flexDirection: 'row', marginTop: 4 },
  cardDetailsLabel: { color: '#64748b', fontSize: 13, marginTop: 2 },
  cardDetailsValue: { color: '#111827', fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
});

export default RequestsList;
