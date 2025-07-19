import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const profilePic = 'https://randomuser.me/api/portraits/men/32.jpg'; // Dummy avatar

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.menuTitle}>Profile</Text>
      <Image source={{ uri: profilePic }} style={styles.avatar} />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>john.doe@example.com</Text>
      <View style={styles.roleBadge}><Text style={styles.roleText}>Role: MEMBER</Text></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#fff', paddingTop: 40 },
  menuTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginTop: 12, marginBottom: 8 },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  email: { fontSize: 15, color: '#6b7280', marginBottom: 8 },
  roleBadge: { backgroundColor: '#f3f4f6', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 18 },
  roleText: { color: '#222', fontWeight: 'bold', fontSize: 14 },
});

export default ProfileScreen; 