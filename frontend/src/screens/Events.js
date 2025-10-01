import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const API = 'http://192.168.1.6:5000/api/events';

export default function Events({ navigation }) {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '' });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API);
      let filtered = res.data;

      if (filters.category) filtered = filtered.filter(e => e.category === filters.category);
      if (filters.location) filtered = filtered.filter(e => e.locationType === filters.location);

      setEvents(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { id: item._id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.category} • {item.locationType}</Text>
      <Text>Start: {item.startDate}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filter Events</Text>
      <Picker
        selectedValue={filters.category}
        onValueChange={(val) => setFilters({ ...filters, category: val })}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Music" value="Music" />
        <Picker.Item label="Tech" value="Tech" />
        <Picker.Item label="Business" value="Business" />
      </Picker>

      <Picker
        selectedValue={filters.location}
        onValueChange={(val) => setFilters({ ...filters, location: val })}
      >
        <Picker.Item label="All Locations" value="" />
        <Picker.Item label="Online" value="Online" />
        <Picker.Item label="In-Person" value="In-Person" />
      </Picker>

      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
});
