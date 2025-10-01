import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title, Paragraph } from 'react-native-paper';

export default function Landing({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Welcome to EventEase</Title>
      <Paragraph style={styles.subtitle}>
        Discover events, book seats, and manage your bookings easily!
      </Paragraph>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Events')}
      >
        Browse Events
      </Button>

      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        Login
      </Button>

      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        Register
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    width: '80%',
    marginVertical: 8,
  },
});
