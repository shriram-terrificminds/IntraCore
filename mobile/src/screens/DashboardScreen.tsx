import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';

const DashboardScreen = () => {
  const { getDashboard, user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getDashboard();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  if (!data) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No data</Text></View>;

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Card>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Role: {data.role}</Text>
      </Card>
      <Card>
        <Text>Requests: {data.requests}</Text>
      </Card>
      <Card>
        <Text>Complaints: {data.complaints}</Text>
      </Card>
    </ScrollView>
  );
};
export default DashboardScreen;
