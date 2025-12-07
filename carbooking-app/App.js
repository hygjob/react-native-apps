import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';
import BookingScreen from './screens/BookingScreen';
import BookingsHistoryScreen from './screens/BookingsHistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Available Cars' }}
          />
          <Stack.Screen 
            name="CarDetails" 
            component={CarDetailsScreen}
            options={{ title: 'Car Details' }}
          />
          <Stack.Screen 
            name="Booking" 
            component={BookingScreen}
            options={{ title: 'Book Your Ride' }}
          />
          <Stack.Screen 
            name="BookingsHistory" 
            component={BookingsHistoryScreen}
            options={{ title: 'My Bookings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

