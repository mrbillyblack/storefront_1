import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, Text, TextInput, Button, StyleSheet } from 'react-native';

import { signIn } from '../config/apiConfig';

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [showError, setShowError] = useState(false);


  const handleSignIn = async () => {
    try {
      const login = await signIn(email, password);
      console.log('API Response:', login);
      
      // Handle data as needed (e.g., update state with fetched items)

    } catch (error) {
      console.error('API Error:', error.message);
      setError(error.message);
      setShowError(false);
    };
    navigation.navigate('Confirm');
    
  };

  return (
    <View style={styles.container}>
        <Image
          source={require('../assets/applogo.jpg')} // Replace with your image path
          style={styles.image}
          resizeMode="contain" // Adjust resizeMode as per your image requirements
        />
      <Text style={styles.title}>Sign In</Text>
      {showError && (
        <Text>Error: {error}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Submit" onPress={() => handleSignIn} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: '35%', // Adjust width as needed
    height: '35%', // Adjust height as needed
    padding: 12,
    alignSelf: 'center',
  },
});

export default HomeScreen;
