import React from 'react';
import { TextInput, View, Text } from 'react-native';
const FormInput = ({ label, ...props }: { label: string; [key: string]: any }) => (
  <View style={{ marginVertical: 8 }}>
    <Text>{label}</Text>
    <TextInput style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 }} {...props} />
  </View>
);
export default FormInput;
