// frontend/screens/Register.js

import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Register({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Register Screen</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('HomeScreen')}
      />
    </View>
  );
}