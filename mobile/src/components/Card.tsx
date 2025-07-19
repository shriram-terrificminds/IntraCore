import React from 'react';
import { View, Text } from 'react-native';
const Card = ({ children }: { children: React.ReactNode }) => (
  <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, margin: 8, elevation: 2 }}>
    {children}
  </View>
);
export default Card;
