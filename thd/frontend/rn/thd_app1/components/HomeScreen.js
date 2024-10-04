import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, Text, TextInput, 
  KeyboardAvoidingView, Button, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

import { signIn, signInGuest, setGlobalState } from '../config/apiConfig';

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSignIn = async () => {
    try {
      const login = await signIn(email, password);
      setGlobalState('username', email);
      console.log('API Response:', login);
    } catch (error) {
      console.error('API Error:', error.message);
      setError(error.message);
      setShowError(true);
    }
    
    navigation.navigate('Confirm');
    setGlobalState('isLoggedIn', true);
  };

  const handleSignInGuest = async () => {
    try {
      const login = await signInGuest();
      setGlobalState('username', 'Guest');
      console.log('API Response:', login);
    } catch (error) {
      console.error('API Error:', error.message);
      setError(error.message);
      setShowError(true);
    }
    
    navigation.navigate('Confirm');
    setGlobalState('isLoggedIn', true);
  };

  return (
      <View style={styles.container}>
          <Text style={styles.title}>Sign In</Text>
          {showError && (
            <Text style={styles.errorText}>Error: {error}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#ccc" // Placeholder text color
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#ccc" // Placeholder text color
          />
          <Pressable style={styles.orangeButton} onPress={handleSignIn}>
            <Text style={styles.text}>Log In</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.text}>Register</Text>
          </Pressable>
          <TouchableOpacity onPress={handleSignInGuest}>
            <Text style={styles.guestText}>..or continue as Guest</Text>
          </TouchableOpacity> 
      </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313338', // Dark background color
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff', // White text color
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#666', // Darker border color
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: '#fff', // White text color
  },
  scrollView: {
    flexGrow: 0,
    backgroundColor: '#313338'
  },
  image: {
    width: '50%', // Adjust width as needed
    height: '50%', // Adjust height as needed
    marginBottom: 20,
  },
  guestText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#b74b28', // Accent color
  },
  errorText: {
    color: '#ff0000', // Error text color
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 12,
    marginTop: '8',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginBottom: 16,
    elevation: 3,
    backgroundColor: 'green',
  },
  orangeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#b74b28',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  }
});

export default HomeScreen;