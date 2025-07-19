import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import StatusChip from '../components/StatusChip';
import { useAuth } from '../contexts/AuthContext';

const MOCK_COMPLAINT = {
  id: '1',
  title: 'Broken Chair',
  description: 'Chair in meeting room is broken.',
  status: 'In-progress',
  user: 'alice',
  role: 'Employee',
  beforeImage: null,
  afterImage: null,
};

const canAct = (role: string) => ['admin', 'devops', 'hr'].includes(role.toLowerCase());

const ComplaintDetail = () => {
  const { user } = useAuth();
  const item = MOCK_COMPLAINT;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.title}</Text>
      <Text style={{ marginBottom: 8 }}>{item.description}</Text>
      <StatusChip status={item.status} />
      <Text style={{ marginTop: 8 }}>Raised by: {item.user}</Text>
      {item.beforeImage && (
        <Image source={{ uri: item.beforeImage }} style={{ width: 100, height: 100, marginTop: 8 }} />
      )}
      {canAct(user?.role) && item.status === 'Pending' && (
        <Button title="Mark In-progress" onPress={() => {}} color="orange" />
      )}
      {canAct(user?.role) && item.status === 'In-progress' && (
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <Button title="Resolve" onPress={() => {}} color="green" />
          <View style={{ width: 16 }} />
          <Button title="Reject" onPress={() => {}} color="red" />
        </View>
      )}
    </View>
  );
};
export default ComplaintDetail;
