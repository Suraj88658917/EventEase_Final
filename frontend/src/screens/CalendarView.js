import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API = 'http://192.168.1.6:5000/api';

export default function CalendarView() {
  const { token } = useContext(AuthContext);
  const [marked, setMarked] = useState({});

  // Fetch bookings and mark them on calendar
  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API}/bookings/me`, {
        headers: { Authorization: 'Bearer ' + token },
      });

      const m = {};
      res.data.forEach((b) => {
        const d = new Date(b.startDate).toISOString().split('T')[0];
        m[d] = { marked: true };
      });

      setMarked(m);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load bookings');
    }
  };

  // If not logged in
  if (!token) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Please login</Text>
      </View>
    );
  }

  // Calendar view
  return (
    <View style={{ flex: 1 }}>
      <Calendar markedDates={marked} />
    </View>
  );
}
