import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Landing from './src/screens/Landing';
import Events from './src/screens/Events';
import EventDetail from './src/screens/EventDetail';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Bookings from './src/screens/Bookings';
import CalendarView from './src/screens/CalendarView';
import AdminPanel from './src/screens/AdminPanel';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Events" component={Events} />
            <Stack.Screen name="EventDetail" component={EventDetail} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Bookings" component={Bookings} />
            <Stack.Screen name="Calendar" component={CalendarView} />
            <Stack.Screen name="Admin" component={AdminPanel} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
