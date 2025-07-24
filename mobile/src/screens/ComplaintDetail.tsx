import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import StatusChip from '../components/StatusChip';
import { useAuth } from '../contexts/AuthContext';
import client from '../utils/client';
import { useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const statusStyles = {
  'Pending Verification': { color: '#b59f00', bg: '#fef9c3', icon: 'access-time', label: 'Pending Verification' },
  'Verified': { color: '#2563eb', bg: '#dbeafe', icon: 'eye-outline', label: 'Verified' },
  'Resolved': { color: '#059669', bg: '#d1fae5', icon: 'check-circle-outline', label: 'Resolved' },
  'In-progress': { color: '#f59e42', bg: '#fef3c7', icon: 'autorenew', label: 'In-progress' },
  'Pending': { color: '#b59f00', bg: '#fef9c3', icon: 'access-time', label: 'Pending' },
  'Rejected': { color: '#ef4444', bg: '#fee2e2', icon: 'cancel', label: 'Rejected' },
};

const canAct = (role: string) => ['admin', 'devops', 'hr'].includes(role?.toLowerCase?.());

const ComplaintDetail = () => {
  const { user } = useAuth();
  const route = useRoute<any>();
  const { id } = route.params;
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      try {
        const data = await client.get(`/complaints/${id}`);
        setComplaint(data);
      } catch (err) {
        setComplaint(null);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  if (!complaint) return <Text style={{ margin: 16 }}>Complaint not found.</Text>;

  const status = statusStyles[complaint.resolution_status as keyof typeof statusStyles];

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={styles.cardTitle}>{complaint.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status?.bg }]}> 
            <MaterialIcons name={status?.icon} size={16} color={status?.color} style={{ marginRight: 2 }} />
            <Text style={{ color: status?.color, fontWeight: 'bold', fontSize: 13 }}>{status?.label}</Text>
          </View>
          <View style={styles.priorityBadge}><Text style={styles.priorityText}>{complaint.priority || '-'}</Text></View>
          <View style={styles.categoryBadge}><Text style={styles.categoryText}>{complaint.role?.name || '-'}</Text></View>
        </View>
        <Text style={styles.cardDesc}>{complaint.description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <MaterialIcons name="image" size={18} color="#222" style={{ marginRight: 4 }} />
          <Text style={styles.attachLabel}>Attached Images ({complaint.images?.length || 0})</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6 }}>
          {complaint.images && complaint.images.length > 0 ? complaint.images.map((img: any, idx: number) => (
            <Image key={idx} source={{ uri: img }} style={styles.thumb} />
          )) : <Text style={{ color: '#64748b' }}>No images</Text>}
        </View>
        <View style={styles.cardDetailsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardDetailsLabel}>Reported by:</Text>
            <Text style={styles.cardDetailsValue}>{complaint.user?.first_name} {complaint.user?.last_name}</Text>
            <Text style={styles.cardDetailsLabel}>Location:</Text>
            <Text style={styles.cardDetailsValue}>{complaint.user?.location_id || '-'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardDetailsLabel}>Assigned to:</Text>
            <Text style={styles.cardDetailsValue}>{complaint.resolved_by ? `${complaint.resolved_by.first_name} ${complaint.resolved_by.last_name}` : '-'}</Text>
            <Text style={styles.cardDetailsLabel}>Date:</Text>
            <Text style={styles.cardDetailsValue}>{complaint.created_at ? complaint.created_at.split('T')[0] : '-'}</Text>
          </View>
        </View>
        {canAct(user?.role || '') && complaint.resolution_status === 'Pending' && (
          <Button title="Mark In-progress" onPress={() => {}} color={'#f59e42'} />
        )}
        {canAct(user?.role || '') && complaint.resolution_status === 'In-progress' && (
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <Button title="Resolve" onPress={() => {}} color={'#059669'} />
            <View style={{ width: 16 }} />
            <Button title="Reject" onPress={() => {}} color={'#ef4444'} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, borderWidth: 1, borderColor: '#e5e7eb' },
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

export default ComplaintDetail;
