import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API = 'http://192.168.1.6:5000/api/events';

export default function EventDetail({ route, navigation }) {
  const { id } = route.params;
  const [event, setEvent] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API}/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const book = async () => {
    if (!token) {
      Alert.alert('Login required', 'Please login to book this event');
      navigation.navigate('Login');
      return;
    }
    try {
      await axios.post(`http://192.168.1.6:5000/api/bookings`, { eventId: id }, { headers: { Authorization: 'Bearer ' + token } });
      Alert.alert('Booked Successfully');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Booking failed');
    }
  };

  if (!event) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{event.title}</Text>
      <Text>Category: {event.category}</Text>
      <Text>Location: {event.location}</Text>
      <Text>Date: {event.date}</Text>
      <Text>Seats Available: {event.capacity}</Text>
      <Button title="Book Now" onPress={book} />
    </View>
  );
}
