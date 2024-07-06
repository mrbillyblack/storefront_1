import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './navigation/AppNavigator';
import HomeScreen from './components/HomeScreen';
import Shop from './components/Shop';

const Stack = createStackNavigator();

function App() {
  return <AppNavigator /> 
  /*
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Shop" component={Shop} />
      </Stack.Navigator>
    </NavigationContainer>
  );*/
}

export default App;