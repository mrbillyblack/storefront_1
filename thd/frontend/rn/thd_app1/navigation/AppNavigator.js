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
import Confirm from '../components/Confirm';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const AuthStack = () => {
  const isLoggedIn = useGlobalState(isLoggedIn);
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, headerStyle:{backgroundColor:'#212121',}, }}>
        {isLoggedIn ? (
          <>
          <Stack.Screen name="Login" component={HomeScreen} />
          <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <>
          <Stack.Screen name="Confirm" component={Confirm}/>
          <Stack.Screen name="Info" component={Info} />
          </>
        )}
    </Stack.Navigator>
  );
};

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
      tabBarActiveTintColor: 'gray',
      tabBarInactiveTintColor: '#212121',
      tabBarShowLabel: false,
      tabBarStyle: [
        {
          display: "flex",
          backgroundColor: '#b74b28'
        },
        null
      ],      
    })}

  >
    <Tab.Screen name="Profile" component={AuthStack} screenOptions={labe}/>
    <Tab.Screen name="Shop" component={ShopStack} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  
  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>    
  );
};