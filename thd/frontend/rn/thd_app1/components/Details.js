// components/Details.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getMenu, placeOrder } from '../config/apiConfig';


const Details = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const data = route.params || {};
    console.log(`passed cart ${data.cart}`);

    const [errorMsg, setErrorMsg] = useState('');
    const [showError, setShowError] = useState(false);
    const [appointment, setAppointment] = useState('');
    

    const handleConfirmOrder = async () => {
      try {
        const response = await placeOrder(data);
        console.log('API Response:', response);

      } catch (error) {
        console.error('API Error:', error.message);
        Alert.alert(`Error: ${error.message}`);
        setErrorMsg(error.message);
        setShowError(true);
      }
      setErrorMsg('');
      setShowError(false);

      navigation.navigate('OrderConfirm', data); // Assume OrderConfirmation is another screen
    };

    
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Order Summary</Text>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data.name}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{data.phone}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data.address}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Order Type:</Text>
          <Text style={styles.value}>{data.pickup ? 'Pickup' : 'Delivery'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Scheduled Time:</Text>
          
        </View>
        <Text style={styles.value}>{`${data.scheduledTime.slice(0, 15)}${data.scheduledTime.slice(33)}`}</Text>
        <View style={styles.cartContainer}>
          <Text style={styles.cartHeader}>Cart Items</Text>
          {Object.keys(data.cart).map(key => {
            const item = data.cart[key];
            return (
          <View key={item.id} style={styles.cartContainer}>
            <Text style={styles.cartItemName}>{item.name}</Text>
            <Text style={styles.cartItemPrice}>Price: ${item.price}</Text>
            <Text style={styles.cartItemQuantity}>Qty: 3.5 x {item.quantity}</Text>
          </View>
            );})}
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Total Cost:</Text>
          <Text style={styles.value}>${data.cartTotal.toFixed(2)}</Text>
          
        </View>
        <Button title="Confirm Order" onPress={handleConfirmOrder} color="#b74b28" />
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#313338',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: '#fff',
    },
    detailItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
    value: {
      fontSize: 16,
      color: '#fff',
    },
    cartContainer: {
      marginVertical: 16,
    },
    cartHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#fff',
    },
    cartItem: {
      marginVertical: 4,
    },
    cartItemName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
    cartItemQuantity: {
      fontSize: 16,
      color: '#fff',
    },
    cartItemPrice: {
      fontSize: 16,
      color: '#fff',
    },
  });
  
  export default Details;
  