// frontend/screens/Confirm.js

import React, { useState, useContext } from 'react';
import { Alert, View, Text, Button, Image, StyleSheet, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';


const Confirm = ({ navigation }) => {
    const route = useRoute();
    const navi = useNavigation();
    const phoneNumber = '(646)960-4716'; // Replace with your phone number

    const handleContactPress = () => {
        const url = `sms:${phoneNumber}`;
        Linking.openURL(url).catch((err) => console.error('Error:', err));
    };

    return( 
        <View style={styles.container}>
            <Image
                source={require('../assets/applogo.jpg')} // Replace with your image path
                style={styles.image}
                resizeMode="contain" // Adjust resizeMode as per your image requirements
            />
            <Text style={{color: 'white'}}>You're logged in!</Text>
            <Text style={{color: 'white'}}>Use the tab navigator to go to the shop menu.</Text>
            <View style={styles.contactButtonContainer}>
                <Button title="Contact" onPress={handleContactPress} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#313338',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    contactButtonContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        paddingHorizontal: 16,
    },
});

export default Confirm;