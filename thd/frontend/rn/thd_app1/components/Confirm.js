// frontend/screens/Confirm.js

import React, { useState } from 'react';
import { Alert, View, Text, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const Confirm = ({ navigation }) => {
    const route = useRoute();
    const navi = useNavigation();

    return( 
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>You're logged in!</Text>
        <Text>Use the tab navigator to go to the shop menu.</Text>
        </View>
        );
};



export default Confirm;