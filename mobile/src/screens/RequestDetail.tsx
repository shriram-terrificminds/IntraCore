import React from 'react';
import { View, Text, Button } from 'react-native';
import StatusChip from '../components/StatusChip';
import { useAuth } from '../contexts/AuthContext';

const MOCK_REQUEST = {
  id: '1',
  title: 'Laptop',
  description: 'Need a new laptop for development.',
  status: 'Pending',
  user: 'alice',
  role: 'Employee',
};

const canAct = (role: string) => ['admin', 'devops', 'hr'].includes(role.toLowerCase());

const RequestDetail = () => {
  const { user } = useAuth();
  const item = MOCK_REQUEST;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.title}</Text>
      <Text style={{ marginBottom: 8 }}>{item.description}</Text>
      <StatusChip status={item.status} />
      <Text style={{ marginTop: 8 }}>Requested by: {item.user}</Text>
      {canAct(user?.role) && item.status === 'Pending' && (
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <Button title="Approve" onPress={() => {}} />
          <View style={{ width: 16 }} />
          <Button title="Reject" onPress={() => {}} color="red" />
        </View>
      )}
      {canAct(user?.role) && item.status === 'Approved' && (
        <Button title="Mark as Delivered" onPress={() => {}} color="blue" />
      )}
      {user?.role?.toLowerCase() === 'employee' && item.status === 'Delivered' && (
        <Button title="Mark as Received" onPress={() => {}} color="purple" />
      )}
    </View>
  );
};
export default RequestDetail;
