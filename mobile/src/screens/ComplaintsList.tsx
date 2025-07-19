import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const FILTERS = ['All Complaints', 'Pending Verification', 'Verified', 'Resolved'];

const MOCK_COMPLAINTS = [
  {
    id: '1',
    title: 'Coffee machine not working',
    status: 'Pending Verification',
    priority: 'medium',
    category: 'Pantry',
    description: 'The coffee machine in the main pantry is not dispensing coffee properly',
    images: [
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=facearea&w=64&h=64',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64',
    ],
    reportedBy: 'John Doe',
    assignedTo: 'Admin Team',
    location: 'Main Office - Floor 3',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'WiFi connectivity issues',
    status: 'Verified',
    priority: 'high',
    category: 'Tech',
    description: 'Frequent disconnections and slow internet speed in the conference room',
    images: [
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64',
    ],
    reportedBy: 'Sarah Smith',
    assignedTo: 'IT Team',
    location: 'Conference Room',
    date: '2024-01-14',
  },
];

const statusStyles = {
  'Pending Verification': { color: '#b59f00', bg: '#fef9c3', icon: 'access-time', label: 'Pending Verification' },
  Verified: { color: '#2563eb', bg: '#dbeafe', icon: 'eye-outline', label: 'Verified' },
  Resolved: { color: '#059669', bg: '#d1fae5', icon: 'check-circle-outline', label: 'Resolved' },
};

const ComplaintsList = () => {
  const [filter, setFilter] = useState('All Complaints');
  const navigation = useNavigation();

  const filtered =
    filter === 'All Complaints'
      ? MOCK_COMPLAINTS
      : MOCK_COMPLAINTS.filter(r => r.status === filter);

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Complaint Management</Text>
          <Text style={styles.subtitle}>Track and resolve office complaints efficiently</Text>
        </View>
        <TouchableOpacity style={styles.newComplaintBtn} onPress={() => navigation.navigate('ComplaintForm')}>
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
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const status = statusStyles[item.status as keyof typeof statusStyles];
          return (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: status?.bg }]}> 
                  <MaterialIcons name={status?.icon} size={16} color={status?.color} style={{ marginRight: 2 }} />
                  <Text style={{ color: status?.color, fontWeight: 'bold', fontSize: 13 }}>{status?.label}</Text>
                </View>
                <View style={styles.priorityBadge}><Text style={styles.priorityText}>{item.priority}</Text></View>
                <View style={styles.categoryBadge}><Text style={styles.categoryText}>{item.category}</Text></View>
              </View>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <MaterialIcons name="image" size={18} color="#222" style={{ marginRight: 4 }} />
                <Text style={styles.attachLabel}>Attached Images ({item.images.length})</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6 }}>
                {item.images.map((img, idx) => (
                  <Image key={idx} source={{ uri: img }} style={styles.thumb} />
                ))}
              </View>
              <View style={styles.cardDetailsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardDetailsLabel}>Reported by:</Text>
                  <Text style={styles.cardDetailsValue}>{item.reportedBy}</Text>
                  <Text style={styles.cardDetailsLabel}>Location:</Text>
                  <Text style={styles.cardDetailsValue}>{item.location}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardDetailsLabel}>Assigned to:</Text>
                  <Text style={styles.cardDetailsValue}>{item.assignedTo}</Text>
                  <Text style={styles.cardDetailsLabel}>Date:</Text>
                  <Text style={styles.cardDetailsValue}>{item.date}</Text>
                </View>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 32 }}
        style={{ marginTop: 8 }}
        scrollEnabled={false}
      />
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
