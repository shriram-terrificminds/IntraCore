import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ImagePickerField from '../components/ImagePickerField';

const ROLES = ['Employee', 'DevOps', 'HR'];

const ComplaintForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [beforeImage, setBeforeImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Complaint Submitted', 'Your complaint has been submitted (mock).');
      setTitle(''); setDescription(''); setRole(ROLES[0]); setBeforeImage(null);
    }, 1000);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>New Complaint</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 8, padding: 8, minHeight: 60 }}
      />
      <Text style={{ marginBottom: 4 }}>Route to Role:</Text>
      <Picker
        selectedValue={role}
        onValueChange={setRole}
        style={{ marginBottom: 8 }}
      >
        {ROLES.map(r => <Picker.Item key={r} label={r} value={r} />)}
      </Picker>
      <ImagePickerField onPick={setBeforeImage} />
      {beforeImage && <Text style={{ marginBottom: 8 }}>Image selected</Text>}
      <Button title={loading ? 'Submitting...' : 'Submit'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
};
export default ComplaintForm;
