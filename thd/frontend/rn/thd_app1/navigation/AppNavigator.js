// frontend/navigation/AppNavigator.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Shop from '../components/Shop';
import HomeScreen from '../components/HomeScreen';
import Info from '../components/Info'
import Register from '../components/Register';
import Checkout from '../components/Checkout';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={HomeScreen} />
    <Stack.Screen name="Info" component={Info} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

const ShopStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Menu" component={Shop} />
    <Stack.Screen name="Checkout" component={Checkout} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Shop') {
          iconName = 'home';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        } 

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#efb810',
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: false,
      tabBarStyle: [
        {
          display: "flex"
        },
        null
      ],      
    })}

  >
    <Tab.Screen name="Profile" component={AuthStack} />
    <Tab.Screen name="Shop" component={ShopStack} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}