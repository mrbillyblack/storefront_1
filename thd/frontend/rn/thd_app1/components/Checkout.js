// components/Checkout.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet, Alert } from 'react-native';
import * as PushNotification from 'expo-notifications';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addDays, format } from 'date-fns';
import { placeOrder, useGlobalState } from '../config/apiConfig'

const generateNextDays = (numDays) => {
  const days = [];
  for (let i = 0; i < numDays; i++) {
    days.push(addDays(new Date(), i));
  }
  return days;
};

const Checkout = ({ navigation }) => {

  const nextDays = generateNextDays(3);
  
  const route = useRoute();
  const navi = useNavigation();
  const { cart = [], cartTotal } = route.params || {};

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isPickup, setPickup] = useState('delivery');
  const [pickupDay, setPickupDay] = useState(nextDays[0]);
  const [pickupTime, setPickupTime] = useState(null);
  const [timeSlot, setTimeSlot] = useState('AM');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAmPmPicker, setShowAmPmPicker] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);

  const username = useGlobalState('username');
  const isLoggedIn = useGlobalState('isLoggedIn');

  const amTimes = [
    '12:00 AM', '12:30 AM', 
    '1:00 AM', '1:30 AM', 
    '2:00 AM', '2:30 AM', 
    '3:00 AM', '3:30 AM', 
    '4:00 AM', '4:30 AM', 
    '5:00 AM', '5:30 AM', 
    '6:00 AM', '6:30 AM', 
    '7:00 AM', '7:30 AM', 
    '8:00 AM', '8:30 AM', 
    '9:00 AM', '9:30 AM', 
    '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM'];

  const pmTimes = [
    '12:00 PM', '12:30 PM', 
    '1:00 PM', '1:30 PM', 
    '2:00 PM', '2:30 PM', 
    '3:00 PM', '3:30 PM', 
    '4:00 PM', '4:30 PM', 
    '5:00 PM', '5:30 PM', 
    '6:00 PM', '6:30 PM', 
    '7:00 PM', '7:30 PM', 
    '8:00 PM', '8:30 PM', 
    '9:00 PM', '9:30 PM', 
    '10:00 PM', '10:30 PM', 
    '11:00 PM', '11:30 PM'];

  const availableTimes = timeSlot === 'AM' ? amTimes : pmTimes;

  // Function to format phone number
  const formatPhoneNumber = (value) => {
      if (!value) return value;
      
      const phoneNumber = value.replace(/[^\d]/g, '');
      const phoneNumberLength = phoneNumber.length;

      if (phoneNumberLength < 4) return phoneNumber;
      if (phoneNumberLength < 7) {
          return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      }

      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Handler for input change
  const handlePhone = (text) => {
      const formattedPhoneNumber = formatPhoneNumber(text);
      setPhone(formattedPhoneNumber);
  };
  

  const handleOrder = async () => {
    if (!name || !phone || !address || !pickupDay || !pickupTime) {
      Alert.alert('Please fill out all fields');
      return;
    }
    
    
    const scheduledTime = `${pickupDay} ${pickupTime}`;
    let pkup = false;
    if (isPickup == 'pickup')  {
      pkup = true;
    };  
    
    if (username == 'Guest'){
      setName(`${name} (Guest)`)
    }
    else setName(username);
    const data = {
      name: name,
      phone: phone,
      address: address,
      pickup: pkup,
      scheduledTime: scheduledTime,
      cart: cart,
      cartTotal: cartTotal
    };
    //console.log(data);
    //moved command to Details
    // const response = await placeOrder(data);
    // console.log('API Response:', response);
    // console.log('email: ', email);
    // console.log('pass: ', password);
    
    // Handle data as needed (e.g., update state with fetched items)
    
    
    navi.navigate('Details', data);

    // PushNotification.localNotification({
    //   title: "Order Confirmation",
    //   message: "Your order has been placed successfully!",
    // });

    // Here you could also send the order details to your backend

  };


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter your details:</Text>
      <TextInput placeholder="Name" placeholderTextColor="#aaa" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Number" placeholderTextColor="#aaa" value={phone} onChangeText={handlePhone} style={styles.input} keyboardType="phone-pad"/>
      <TextInput placeholder="Address" placeholderTextColor="#aaa" value={address} onChangeText={setAddress} style={styles.input} />
      
      <Text style={styles.text}>Select Pickup/Delivery Day:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)} style={styles.input}>
        <Text style={styles.text}>{pickupDay ? format(pickupDay, 'eeee, MMM d') : 'Select Date'}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <Button title="Close" onPress={() => setShowDatePicker(false)} />
            <Picker
              selectedValue={pickupDay}
              onValueChange={(itemValue) => {
                setPickupDay(itemValue);
              }}
              style={styles.picker}
            >
              {nextDays.map((day) => (
                <Picker.Item key={day.toString()} label={format(day, 'eeee, MMM d')} value={day} />
              ))}
            </Picker>
          </View>
        </Modal>
      )}

      <Text style={styles.text}>Select AM/PM:</Text>
      <TouchableOpacity onPress={() => setShowAmPmPicker(!showAmPmPicker)} style={styles.input}>
        <Text style={styles.text}>{timeSlot ? timeSlot : 'Select AM/PM'}</Text>
      </TouchableOpacity>
      {showAmPmPicker && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <Button title="Close" onPress={() => setShowAmPmPicker(false)} />
            <Picker
              selectedValue={timeSlot}
              onValueChange={(itemValue) => {
                setTimeSlot(itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="AM" value="AM" />
              <Picker.Item label="PM" value="PM" />
            </Picker>
          </View>
        </Modal>
      )}

      <Text style={styles.text}>Select Pickup/Delivery Time:</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(!showTimePicker)} style={styles.input}>
        <Text style={styles.text}>{pickupTime ? pickupTime : 'Select Time'}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <Button title="Close" onPress={() => setShowTimePicker(false)} />
            <Picker
              selectedValue={pickupTime}
              onValueChange={(itemValue) => {
                setPickupTime(itemValue);
              }}
              style={styles.picker}
            >
              {availableTimes.map((time) => (
                <Picker.Item key={time} label={time} value={time} />
              ))}
            </Picker>
          </View>
        </Modal>
      )}

      <Text style={styles.text}>Select Pickup or Delivery:</Text>
      <RadioButton.Group
        onValueChange={value => setPickup(value)}
        value={isPickup}
      >
        <View style={styles.radioContainer}>
          <View style={styles.radioItem}>
            <RadioButton value="pickup" color="#fff"/>
            <Text style={styles.text}>Pickup</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="delivery" color="#fff"/>
            <Text style={styles.text}>Delivery</Text>
          </View>
        </View>
      </RadioButton.Group>

      <Button title="Place Order" onPress={handleOrder} color="#b94b28"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#313338',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  text: {
    color: '#fff',
  },
});

export default Checkout;