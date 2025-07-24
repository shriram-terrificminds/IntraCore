import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import client from '../utils/client';

const FILTERS = ['All Complaints', 'Pending Verification', 'Verified', 'Resolved', 'In-progress', 'Pending', 'Rejected'];

const statusStyles = {
  'Pending Verification': { color: '#b59f00', bg: '#fef9c3', icon: 'access-time', label: 'Pending Verification' },
  'Verified': { color: '#2563eb', bg: '#dbeafe', icon: 'eye-outline', label: 'Verified' },
  'Resolved': { color: '#059669', bg: '#d1fae5', icon: 'check-circle-outline', label: 'Resolved' },
  'In-progress': { color: '#f59e42', bg: '#fef3c7', icon: 'autorenew', label: 'In-progress' },
  'Pending': { color: '#b59f00', bg: '#fef9c3', icon: 'access-time', label: 'Pending' },
  'Rejected': { color: '#ef4444', bg: '#fee2e2', icon: 'cancel', label: 'Rejected' },
};

const ComplaintsList = () => {
  const [filter, setFilter] = useState('All Complaints');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchComplaints = async () => {
        setLoading(true);
        try {
          const data = await client.post('/complaints/list', { search: '', page });
          setComplaints(data.data || []);
        } catch (err) {
          console.error('Failed to fetch complaints:', err);
          setComplaints([]);
        } finally {
          setLoading(false);
        }
      };
      fetchComplaints();
    }, [page])
  );

  const filtered: any[] =
    filter === 'All Complaints'
      ? complaints
      : complaints.filter(r => r.resolution_status === filter);

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Complaint Management</Text>
          <Text style={styles.subtitle}>Track and resolve office complaints efficiently</Text>
        </View>
        <TouchableOpacity style={styles.newComplaintBtn} onPress={() => (navigation as any).navigate('ComplaintForm')}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.newComplaintText}>New Complaint</Text>
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
            const status = statusStyles[item.resolution_status as keyof typeof statusStyles];
            return (
              <TouchableOpacity onPress={() => (navigation as any).navigate('ComplaintDetail', { id: item.id })} activeOpacity={0.85} style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: status?.bg }]}> 
                    <MaterialIcons name={status?.icon} size={16} color={status?.color} style={{ marginRight: 2 }} />
                    <Text style={{ color: status?.color, fontWeight: 'bold', fontSize: 13 }}>{status?.label}</Text>
                  </View>
                  <View style={styles.priorityBadge}><Text style={styles.priorityText}>{item.priority || '-'}</Text></View>
                  <View style={styles.categoryBadge}><Text style={styles.categoryText}>{item.role?.name || '-'}</Text></View>
                </View>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <MaterialIcons name="image" size={18} color="#222" style={{ marginRight: 4 }} />
                  <Text style={styles.attachLabel}>Attached Images ({item.images?.length || 0})</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6 }}>
                  {item.images && item.images.length > 0 ? item.images.map((img: any, idx: number) => (
                    <Image key={idx} source={{ uri: img }} style={styles.thumb} />
                  )) : <Text style={{ color: '#64748b' }}>No images</Text>}
                </View>
                <View style={styles.cardDetailsRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardDetailsLabel}>Reported by:</Text>
                    <Text style={styles.cardDetailsValue}>{item.user?.first_name} {item.user?.last_name}</Text>
                    <Text style={styles.cardDetailsLabel}>Location:</Text>
                    <Text style={styles.cardDetailsValue}>{item.user?.location_id || '-'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardDetailsLabel}>Assigned to:</Text>
                    <Text style={styles.cardDetailsValue}>{item.resolved_by ? `${item.resolved_by.first_name} ${item.resolved_by.last_name}` : '-'}</Text>
                    <Text style={styles.cardDetailsLabel}>Date:</Text>
                    <Text style={styles.cardDetailsValue}>{item.created_at ? item.created_at.split('T')[0] : '-'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 32 }}
          style={{ marginTop: 8 }}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32, color: '#64748b' }}>No complaints found.</Text>}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'stretch', padding: 20, paddingBottom: 0 },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 2 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 8 },
  newComplaintBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 0, height: 48, alignSelf: 'flex-start', marginLeft: 12, justifyContent: 'center' },
  newComplaintText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 4 },
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
  categoryBadge: { backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  categoryText: { color: '#334155', fontWeight: 'bold', fontSize: 13 },
  cardDesc: { color: '#64748b', fontSize: 15, marginTop: 4, marginBottom: 10 },
  attachLabel: { color: '#222', fontWeight: 'bold', fontSize: 14 },
  thumb: { width: 38, height: 38, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  cardDetailsRow: { flexDirection: 'row', marginTop: 4 },
  cardDetailsLabel: { color: '#64748b', fontSize: 13, marginTop: 2 },
  cardDetailsValue: { color: '#111827', fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
});

export default ComplaintsList;
