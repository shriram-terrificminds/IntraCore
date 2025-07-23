import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import client, { getToken } from '../utils/client';

const CATEGORIES = ['Tech', 'Furniture', 'Stationery', 'Other'];
const PRIORITIES = ['low', 'medium', 'high'];
const DEPARTMENTS = ['DevOps', 'HR', 'Admin', 'Other'];
const LOCATIONS = ['Headquarters', 'North Branch', 'South Branch'];

const RequestForm = ({ navigation }: any) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  // Dummy image upload state
  const [images, setImages] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!itemName || !description) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const token = await getToken();
      const body = {
        title: itemName,
        description,
        role_id: "2", // You may want to map this from department/category
      };
      const response = await fetch('http://10.0.2.2:8000/api/inventory-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Request submitted successfully.');
        navigation?.goBack?.();
      } else {
        Alert.alert('Error', data.message || 'Failed to submit request.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>New Inventory Request</Text>
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Wireless Mouse, Office Chair"
        value={itemName}
        onChangeText={setItemName}
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
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Department</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={department}
              onValueChange={setDepartment}
              style={styles.picker}
            >
              <Picker.Item label="Select department" value="" />
              {DEPARTMENTS.map(d => <Picker.Item key={d} label={d} value={d} />)}
            </Picker>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={location}
              onValueChange={setLocation}
              style={styles.picker}
            >
              <Picker.Item label="Select location" value="" />
              {LOCATIONS.map(l => <Picker.Item key={l} label={l} value={l} />)}
            </Picker>
          </View>
        </View>
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
        placeholder="Describe why you need this item..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Supporting Images (Optional)</Text>
      <TouchableOpacity style={styles.imageUpload}>
        <MaterialIcons name="cloud-upload" size={36} color="#a3a3a3" />
        <Text style={styles.imageUploadText}>Click to upload or drag and drop images</Text>
        <Text style={styles.imageUploadHint}>PNG, JPG up to 10MB</Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation?.goBack?.()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit Request'}</Text>
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

export default RequestForm;
