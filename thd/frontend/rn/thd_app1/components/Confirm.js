// frontend/screens/Confirm.js

import React, { useState, useContext } from 'react';
import { Alert, View, Text, Button, Image, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';




const Confirm = ({ navigation }) => {
    const route = useRoute();
    const navi = useNavigation();

    

    const handleSignIn = async () => {
        try {
          const login = await signIn(email, password);
          setGlobalState('username', email);
          // setGlobalState('userID', login.session.user.id);
          console.log('API Response:', login);
          
          // Handle data as needed (e.g., update state with fetched items)
    
        } catch (error) {
          console.error('API Error:', error.message);
          setError(error.message);
          setShowError(false);
        };
        
        
        navigation.navigate('Confirm');
        setGlobalState('isLoggedIn', true);
        
      };

    return( 
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <Image
          source={require('../assets/applogo.jpg')} // Replace with your image path
          style={styles.image}
          resizeMode="contain" // Adjust resizeMode as per your image requirements
        />
        <Text>You're logged in!</Text>
        <Text>Use the tab navigator to go to the shop menu.</Text>
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



export default Confirm;