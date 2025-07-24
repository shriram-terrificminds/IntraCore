import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import StatusChip from '../components/StatusChip';
import { useAuth } from '../contexts/AuthContext';
import client from '../utils/client';
import { useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const statusStyles = {
  Pending: { color: '#b59f00', bg: '#fef9c3', icon: 'access-time' },
  Approved: { color: '#2563eb', bg: '#dbeafe', icon: 'check-circle-outline' },
  Delivered: { color: '#059669', bg: '#d1fae5', icon: 'cube-outline' },
};

const canAct = (role: string) => ['admin', 'devops', 'hr'].includes(role?.toLowerCase?.());

const RequestDetail = () => {
  const { user } = useAuth();
  const route = useRoute<any>();
  const { id } = route.params;
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const data = await client.get(`/inventory-requests/${id}`);
        setRequest(data);
      } catch (err) {
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  if (!request) return <Text style={{ margin: 16 }}>Request not found.</Text>;

  const status = statusStyles[request.status as keyof typeof statusStyles];

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={styles.cardTitle}>{request.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status?.bg }]}> 
            <MaterialIcons name={status?.icon} size={16} color={status?.color} style={{ marginRight: 2 }} />
            <Text style={{ color: status?.color, fontWeight: 'bold', fontSize: 13 }}>{request.status}</Text>
          </View>
          <View style={styles.priorityBadge}><Text style={styles.priorityText}>{request.priority || '-'}</Text></View>
          <View style={styles.locationBadge}>
            <MaterialIcons name="location-on" size={15} color="#64748b" style={{ marginRight: 2 }} />
            <Text style={styles.locationText}>{request.location || '-'}</Text>
          </View>
        </View>
        <Text style={styles.cardDesc}>{request.description}</Text>
        <View style={styles.cardDetailsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardDetailsLabel}>Requested by:</Text>
            <Text style={styles.cardDetailsValue}>{request.requestedBy || '-'}</Text>
            <Text style={styles.cardDetailsLabel}>Category:</Text>
            <Text style={styles.cardDetailsValue}>{request.category || '-'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardDetailsLabel}>Department:</Text>
            <Text style={styles.cardDetailsValue}>{request.department || '-'}</Text>
            <Text style={styles.cardDetailsLabel}>Date:</Text>
            <Text style={styles.cardDetailsValue}>{request.date || '-'}</Text>
          </View>
        </View>
        {canAct(user?.role || '') && request.status === 'Pending' && (
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <Button title="Approve" onPress={() => {}} />
            <View style={{ width: 16 }} />
            <Button title="Reject" onPress={() => {}} color="red" />
          </View>
        )}
        {canAct(user?.role || '') && request.status === 'Approved' && (
          <Button title="Mark as Delivered" onPress={() => {}} color="blue" />
        )}
        {user?.role?.toLowerCase() === 'employee' && request.status === 'Delivered' && (
          <Button title="Mark as Received" onPress={() => {}} color="purple" />
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
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  locationText: { color: '#334155', fontWeight: 'bold', fontSize: 13 },
  cardDesc: { color: '#64748b', fontSize: 15, marginTop: 4, marginBottom: 10 },
  cardDetailsRow: { flexDirection: 'row', marginTop: 4 },
  cardDetailsLabel: { color: '#64748b', fontSize: 13, marginTop: 2 },
  cardDetailsValue: { color: '#111827', fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
});

export default RequestDetail;
