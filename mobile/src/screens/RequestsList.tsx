import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import StatusChip from '../components/StatusChip';
import { useNavigation } from '@react-navigation/native';

const MOCK_REQUESTS = [
  { id: '1', title: 'Laptop', status: 'Pending', user: 'alice', role: 'Employee' },
  { id: '2', title: 'Monitor', status: 'Approved', user: 'bob', role: 'Employee' },
  { id: '3', title: 'Keyboard', status: 'Delivered', user: 'alice', role: 'Employee' },
  { id: '4', title: 'Mouse', status: 'Rejected', user: 'bob', role: 'Employee' },
];

const canAct = (role: string) => ['admin', 'devops', 'hr'].includes(role.toLowerCase());

const RequestsList = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Filter by role
    let data = MOCK_REQUESTS;
    if (user?.role?.toLowerCase() === 'employee') {
      data = data.filter(r => r.user === user.email.split('@')[0]);
    }
    setRequests(data);
    setLoading(false);
  }, [user]);

  const filtered = requests.filter(r =>
    (!statusFilter || r.status === statusFilter) &&
    (!search || r.title.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Search requests..."
        value={search}
        onChangeText={setSearch}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 8, padding: 8 }}
      />
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        {['', 'Pending', 'Approved', 'Delivered', 'Rejected'].map(s => (
          <TouchableOpacity key={s} onPress={() => setStatusFilter(s)} style={{ marginRight: 8 }}>
            <Text style={{ color: statusFilter === s ? '#007AFF' : '#333' }}>{s || 'All'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('RequestDetail', { id: item.id })}>
            <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <StatusChip status={item.status} />
              {canAct(user?.role) && item.status === 'Pending' && (
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity style={{ marginRight: 12 }}><Text style={{ color: 'green' }}>Approve</Text></TouchableOpacity>
                  <TouchableOpacity><Text style={{ color: 'red' }}>Reject</Text></TouchableOpacity>
                </View>
              )}
              {canAct(user?.role) && item.status === 'Approved' && (
                <TouchableOpacity style={{ marginTop: 8 }}><Text style={{ color: 'blue' }}>Mark as Delivered</Text></TouchableOpacity>
              )}
              {user?.role?.toLowerCase() === 'employee' && item.status === 'Delivered' && (
                <TouchableOpacity style={{ marginTop: 8 }}><Text style={{ color: 'purple' }}>Mark as Received</Text></TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32 }}>No requests found.</Text>}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('RequestForm')}
        accessibilityLabel="Create new request"
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default RequestsList;
