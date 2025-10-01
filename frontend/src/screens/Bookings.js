import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API = 'http://192.168.1.6:5000/api';

export default function Bookings() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bookings/me`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    try {
      await axios.post(
        `${API}/bookings/${id}/cancel`,
        {},
        { headers: { Authorization: 'Bearer ' + token } }
      );
      Alert.alert('Cancelled');
      fetchBookings();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Cancel failed');
    }
  };

  // Show login prompt if no token
  if (!token) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16 }}>Please login to see your bookings</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16 }}>You have no bookings yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>
              Seats: {item.seats} • Status: {item.status}
            </Text>
            {item.status !== 'Cancelled' && (
              <Button title="Cancel" onPress={() => cancel(item.id)} />
            )}
          </View>
        )}
      />
    </View>
  );
}
