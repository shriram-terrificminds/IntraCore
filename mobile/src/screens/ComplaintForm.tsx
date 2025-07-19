import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CATEGORIES = ['Pantry', 'Tech', 'HR', 'Admin'];
const PRIORITIES = ['low', 'medium', 'high'];

const ComplaintForm = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  // Dummy image upload state
  const [images, setImages] = useState<any[]>([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Submit New Complaint</Text>
      <Text style={styles.label}>Complaint Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Brief description of the issue"
        value={title}
        onChangeText={setTitle}
      />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              style={styles.picker}
            >
              <Picker.Item label="Select category" value="" />
              {CATEGORIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
            </Picker>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={priority}
              onValueChange={setPriority}
              style={styles.picker}
            >
              <Picker.Item label="Select priority" value="" />
              {PRIORITIES.map(p => <Picker.Item key={p} label={p} value={p} />)}
            </Picker>
          </View>
        </View>
      </View>
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Conference Room A, Floor 2"
        value={location}
        onChangeText={setLocation}
      />
      <Text style={styles.label}>Detailed Description</Text>
      <TextInput
        style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
        placeholder="Provide detailed information about the issue..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Supporting Images (Optional)</Text>
      <TouchableOpacity style={styles.imageUpload}>
        <MaterialIcons name="cloud-upload" size={36} color="#a3a3a3" />
        <Text style={styles.imageUploadText}>Click to upload or drag and drop images</Text>
        <Text style={styles.imageUploadHint}>Before/after photos help with resolution</Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation?.goBack?.()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>Submit Complaint</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1 },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  label: { fontWeight: 'bold', fontSize: 15, marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 0, backgroundColor: '#f9fafb' },
  pickerWrapper: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, backgroundColor: '#f9fafb', marginBottom: 0 },
  picker: { height: 44, width: '100%' },
  imageUpload: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', padding: 24, marginTop: 8, marginBottom: 16, backgroundColor: '#fafafa' },
  imageUploadText: { color: '#52525b', fontSize: 15, marginTop: 8 },
  imageUploadHint: { color: '#a3a3a3', fontSize: 13, marginTop: 2 },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24, gap: 12 },
  cancelBtn: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 },
  cancelText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  submitBtn: { backgroundColor: '#111827', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ComplaintForm;
