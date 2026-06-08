import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, Text, TextInput,
  KeyboardAvoidingView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

import { signIn, signInGuest, signInWithGoogle, setGlobalState } from '../config/apiConfig';

WebBrowser.maybeCompleteAuthSession();

const { googleExpoClientId, googleWebClientId, googleIosClientId, googleAndroidClientId } =
  Constants.expoConfig?.extra || {};

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: googleExpoClientId,
    webClientId: googleWebClientId,
    iosClientId: googleIosClientId,
    androidClientId: googleAndroidClientId,
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        const { authentication } = response;
        try {
          const profileRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          });
          const profile = await profileRes.json();
          await signInWithGoogle(authentication.idToken, profile);
          navigation.navigate('Confirm');
        } catch (err) {
          console.error('Google Sign In Error:', err);
          setError('Could not sign in with Google. Please try again.');
          setShowError(true);
        }
      }
    };
    handleGoogleResponse();
  }, [response]);

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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.card}>
        <Text style={styles.brand}>Herb &amp; Bloom</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {showError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9aa0a6"
        />

        <Pressable style={styles.primaryButton} onPress={handleSignIn}>
          <Text style={styles.primaryButtonText}>Log In</Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={styles.googleButton}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Image
            source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.secondaryButtonText}>Create an account</Text>
        </Pressable>

        <TouchableOpacity onPress={handleSignInGuest}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#b6bac1',
    marginBottom: 20,
    marginTop: 4,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#494d54',
  },
  dividerText: {
    color: '#9aa0a6',
    marginHorizontal: 10,
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3c4043',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#494d54',
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  guestText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#e08a5f',
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

export default HomeScreen;
