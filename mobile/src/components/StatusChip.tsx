import React from 'react';
import { View, Text } from 'react-native';
const StatusChip = ({ status }: { status: string }) => (
  <View style={{ padding: 8, backgroundColor: '#eee', borderRadius: 16 }}>
    <Text>{status}</Text>
  </View>
);
export default StatusChip;
