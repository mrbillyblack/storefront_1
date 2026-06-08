// frontend/screens/Register.js

import React, { useState } from 'react';
import { Alert, View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, ScrollView } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.brand}>Herb &amp; Bloom</Text>
          <Text style={styles.title}>Create your account</Text>

          {showError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9aa0a6"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={userName}
            onChangeText={setUserName}
            placeholderTextColor="#9aa0a6"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9aa0a6"
          />
          <Pressable style={styles.primaryButton} onPress={() => handleSignUp()}>
            <Text style={styles.primaryButtonText}>Register</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2125',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#2b2e33',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#e08a5f',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 48,
    width: '100%',
    borderColor: '#494d54',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 14,
    color: '#fff',
    backgroundColor: '#34373d',
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: '#b74b28',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.25,
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 76, 76, 0.12)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    fontSize: 13,
  },
});