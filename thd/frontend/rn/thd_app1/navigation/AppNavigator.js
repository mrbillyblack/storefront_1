// frontend/navigation/AppNavigator.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useGlobalState } from '../config/apiConfig';
import Shop from '../components/Shop';
import HomeScreen from '../components/HomeScreen';
import OrderConfirm from '../components/OrderConfirm';
import Register from '../components/Register';
import Checkout from '../components/Checkout';
import Confirm from '../components/Confirm';
import Details from '../components/Details';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const AuthStack = () => {
  const isLoggedIn = useGlobalState('isLoggedIn');
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
        {!isLoggedIn ? (
          <>
          <Stack.Screen name="Confirm" component={Confirm}/>
          </>
        ) : (
          <>
          <Stack.Screen name="Login" component={HomeScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Confirm" component={Confirm}/>
          {/* <Stack.Screen name="Info" component={Info} /> */}
          </>
        )}
    </Stack.Navigator>
  );
};

const ShopStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false,
    headerStyle: {
      backgroundColor: '#313338', // Header background color
    },
    headerTintColor: '#fff', // Header text color
    headerTitleStyle: {
      color: '#fff', // Header title color
    },
    
    }}>
    <Stack.Screen name="Menu" component={Shop} />
    <Stack.Screen name="Checkout" component={Checkout} />
    <Stack.Screen name="Details" component={Details} />
    <Stack.Screen name="OrderConfirm" component={OrderConfirm} />
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
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#212121',
      tabBarStyle: [
        {
          display: "flex",
          backgroundColor: '#b74b28',
          tabBarLabelStyle: {
            color: '#b74b28',
          },
        },
        null
        ],
      // unmountOnBlur: true,
      lazy: true,
    })}

  >
    <Tab.Screen name="Profile" component={AuthStack} options={{
      headerStyle: {
        backgroundColor: '#b74b28'
        
      },
      headerTitleStyle: {
        color: '#fff',
      },
      }}/>
    <Tab.Screen name="Shop" component={ShopStack} options={{
      headerStyle: {
        backgroundColor: '#b74b28'
        
      },
      headerTitleStyle: {
        color: '#fff',
      },
      }}/>
  </Tab.Navigator>
);

export default function AppNavigator() {
  
  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>    
  );
};