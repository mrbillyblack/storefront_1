// components/Checkout.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet, Alert } from 'react-native';
import * as PushNotification from 'expo-notifications';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addDays, format } from 'date-fns';

const generateNextDays = (numDays) => {
  const days = [];
  for (let i = 0; i < numDays; i++) {
    days.push(addDays(new Date(), i));
  }
  return days;
};

const Checkout = ({ navigation }) => {
  
  const route = useRoute();
  const navi = useNavigation();
  const { cart = [] } = route.params || {};

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isPickup, setPickup] = useState('pickup')
  const [pickupDay, setPickupDay] = useState(null)
  const [pickupTime, setPickupTime] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAmPmPicker, setShowAmPmPicker] = useState(false);


  const nextDays = generateNextDays(3);
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
  

  const handleOrder = () => {
    if (!name || !number || !address || !pickupDay || !pickupTime) {
      Alert.alert('Please fill out all fields');
      return;
    }
    
    navi.navigate('Menu', {
      day: pickupDay,
      time: pickupTime,
      mode: isPickup,
      order: cart
    });

    // PushNotification.localNotification({
    //   title: "Order Confirmation",
    //   message: "Your order has been placed successfully!",
    // });

    // Here you could also send the order details to your backend

    Alert.alert('Order placed successfully!');
  };

   
  return (
    <View style={styles.container}>
      <Text>Enter your details:</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Number" value={number} onChangeText={setNumber} style={styles.input} keyboardType="phone-pad"/>
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
      
      <Text>Select Pickup/Delivery Day:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)} style={styles.input}>
        <Text>{pickupDay ? format(pickupDay, 'eeee, MMM d') : 'Select Date'}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <Modal transparent={true} animationType="none">
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={pickupDay}
              onValueChange={(itemValue) => {
                setPickupDay(itemValue);
                setShowDatePicker(false);
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

      <Text>Select AM/PM:</Text>
      <TouchableOpacity onPress={() => setShowAmPmPicker(!showAmPmPicker)} style={styles.input}>
        <Text>{timeSlot ? timeSlot : 'Select AM/PM'}</Text>
      </TouchableOpacity>
      {showAmPmPicker && (
        <Modal transparent={true} animationType="none">
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={timeSlot}
              onValueChange={(itemValue) => {
                setTimeSlot(itemValue);
                setShowAmPmPicker(false);
              }}
              style={styles.picker}
            >
              <Picker.Item label="AM" value="AM" />
              <Picker.Item label="PM" value="PM" />
            </Picker>
          </View>
        </Modal>
      )}

      <Text>Select Pickup/Delivery Time:</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(!showTimePicker)} style={styles.input}>
        <Text>{pickupTime ? pickupTime : 'Select Time'}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <Modal transparent={true} animationType="none">
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={pickupTime}
              onValueChange={(itemValue) => {
                setPickupTime(itemValue);
                setShowTimePicker(false);
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

      <Text>Select Pickup or Delivery:</Text>
      <RadioButton.Group
        onValueChange={value => setPickup(value)}
        value={isPickup}
      >
        <View style={styles.radioContainer}>
          <View style={styles.radioItem}>
            <RadioButton value="pickup" />
            <Text>Pickup</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="delivery" />
            <Text>Delivery</Text>
          </View>
        </View>
      </RadioButton.Group>

      <Button title="Place Order" onPress={handleOrder}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
});

export default Checkout;
