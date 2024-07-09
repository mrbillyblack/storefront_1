// frontend/screens/Register.js

import React, { useState } from 'react';
import { Alert, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signUp } from '../config/apiConfig'


export default function Register({ navigation }) {

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showError, setShowError] = useState(false);


  const handleSignUp = async () => {
    try {
      const signup = await signUp(email, password, userName);
      console.log('API Response:', signup);
      console.log('email: ', email);
      console.log('pass: ', password);
      
      // Handle data as needed (e.g., update state with fetched items)

    } catch (error) {
      console.error('API Error:', error.message);
      setErrorMsg(error.message);
      setShowError(true);
    }
    setErrorMsg('');
    setShowError(false);
    Alert.alert('Registry successful!');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {showError && (
        <Text>Error: {errorMsg}</Text>
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
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={() => handleSignUp()} />
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
});