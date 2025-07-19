import React from 'react';
import { View, Text, Button } from 'react-native';
const ImagePickerField = ({ onPick }: { onPick: (image: any) => void }) => (
  <View style={{ marginVertical: 8 }}>
    <Text>Image Picker Field</Text>
    <Button title="Pick Image" onPress={() => onPick({ uri: '', base64: '' })} />
  </View>
);
export default ImagePickerField;
