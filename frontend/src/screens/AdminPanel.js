import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API = 'http://192.168.1.6:5000/api';

export default function AdminPanel() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  // Form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech');
  const [locationType, setLocationType] = useState('In-Person');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [capacity, setCapacity] = useState('50');

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create event
  const createEvent = async () => {
    if (!token) return Alert.alert('Admin only');
    try {
      const payload = {
        title,
        category,
        locationType,
        location,
        startDate,
        endDate: startDate, // same as startDate for now
        capacity: parseInt(capacity),
      };
      await axios.post(`${API}/events`, payload, {
        headers: { Authorization: 'Bearer ' + token },
      });
      Alert.alert('Created');
      fetchEvents();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Create failed');
    }
  };

  // Delete event
  const del = async (id) => {
    try {
      await axios.delete(`${API}/events/${id}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      Alert.alert('Deleted');
      fetchEvents();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Delete failed');
    }
  };

  // View attendees
  const viewAttendees = async (eventId) => {
    try {
      const res = await axios.get(
        `${API}/bookings/event/${eventId}/attendees`,
        { headers: { Authorization: 'Bearer ' + token } }
      );
      Alert.alert('Attendees', JSON.stringify(res.data, null, 2));
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed');
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>Admin Panel</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginVertical: 6 }}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginVertical: 6 }}
      />

      <TextInput
        placeholder="LocationType"
        value={locationType}
        onChangeText={setLocationType}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginVertical: 6 }}
      />

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginVertical: 6 }}
      />

      <TextInput
        placeholder="StartDate YYYY-MM-DD"
        value={startDate}
        onChangeText={setStartDate}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginVertical: 6 }}
      />

      <TextInput
        placeholder="Capacity"
        value={capacity}
        onChangeText={setCapacity}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginVertical: 6 }}
      />

      <Button title="Create Event" onPress={createEvent} />

      <View style={{ height: 12 }} />

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
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
              {item.startDate} • {item.location}
            </Text>
            <Button title="View Attendees" onPress={() => viewAttendees(item.eventId)} />
            <Button title="Delete" onPress={() => del(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
