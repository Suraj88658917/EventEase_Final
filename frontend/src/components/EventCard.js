import React from 'react';
import { View, Text, Button } from 'react-native';

export default function EventCard({ event, onPress }) {
  return (
    <View style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 8 }}>
      <Text style={{ fontWeight: 'bold' }}>{event.title}</Text>
      <Text>{event.category} | {event.location} | {event.date}</Text>
      <Button title="View Details" onPress={() => onPress(event)} />
    </View>
  );
}
