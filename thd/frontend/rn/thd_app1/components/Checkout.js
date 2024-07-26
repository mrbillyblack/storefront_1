// components/Checkout.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet, ScrollView, Keyboard, Platform } from 'react-native';
import * as PushNotification from 'expo-notifications';
import { RadioButton } from 'react-native-paper';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addDays, format } from 'date-fns';
import { placeOrder, useGlobalState } from '../config/apiConfig';

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
  const [phoneValid, setPhoneValid] = useState(true);

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
    '11:00 AM', '11:30 AM'
  ];

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
    '11:00 PM', '11:30 PM'
  ];

  const availableTimes = timeSlot === 'AM' ? amTimes : pmTimes;

  const formatPhoneNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3)}`;
    }
    if (phoneNumberLength >= 10) {
      Keyboard.dismiss();
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhone = (text) => {
    const formattedPhoneNumber = formatPhoneNumber(text);
    setPhone(formattedPhoneNumber);
  };

  const handleOrder = async () => {
    let hasError = false;

    if (!name) {
      setErrorMsg('Please fill out all fields');
      hasError = true;
    }
    if (!phone || !isValidPhoneNumber(phone, 'US')) {
      setPhoneValid(false);
      hasError = true;
    } else {
      setPhoneValid(true);
    }
    if (!pickupDay || !pickupTime) {
      setErrorMsg('Please fill out all fields');
      hasError = true;
    }

    if (hasError) {
      setShowError(true);
      return;
    }

    const scheduledTime = `${pickupDay} ${pickupTime}`;
    let pkup = false;
    if (isPickup == 'pickup') {
      pkup = true;
    }

    if (username == 'Guest') {
      setName(`${name} (Guest)`)
    } else setName(username);

    const data = {
      name: name,
      phone: phone,
      address: address,
      pickup: pkup,
      scheduledTime: scheduledTime,
      cart: cart,
      cartTotal: cartTotal
    };

    navi.navigate('Details', data);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.text}>Enter your details:</Text>
        {showError && !name && (
          <Text style={styles.errorText}>Name is required</Text>
        )}
        <TextInput placeholder="Email" placeholderTextColor="#aaa" value={name} onChangeText={setName} style={styles.input} />
        {showError && (!phone || !phoneValid) && (
          <Text style={styles.errorText}>Enter a valid phone number</Text>
        )}
        <TextInput placeholder="Number" placeholderTextColor="#aaa" value={phone} onChangeText={handlePhone} style={[styles.input, !phoneValid && styles.inputError]} keyboardType="phone-pad" />
        <TextInput placeholder="Address (leave blank if pickup)" placeholderTextColor="#aaa" value={address} onChangeText={setAddress} style={styles.input} />

        <Text style={styles.text}>Select Pickup/Delivery Day:</Text>
        {Platform.OS === 'web' ? (
          <select
            value={pickupDay}
            onChange={(e) => setPickupDay(e.target.value)}
            style={styles.webDropdown}
          >
            {nextDays.map((day) => (
              <option key={day.toString()} value={day}>
                {format(day, 'eeee, MMM d')}
              </option>
            ))}
          </select>
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)} style={styles.input}>
              <Text style={styles.text}>{pickupDay ? format(pickupDay, 'eeee, MMM d') : 'Select Date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <Modal transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                  <Button title="Close" onPress={() => setShowDatePicker(false)} />
                  <Picker
                    selectedValue={pickupDay}
                    onValueChange={(itemValue) => setPickupDay(itemValue)}
                    style={styles.picker}
                  >
                    {nextDays.map((day) => (
                      <Picker.Item key={day.toString()} label={format(day, 'eeee, MMM d')} value={day} />
                    ))}
                  </Picker>
                </View>
              </Modal>
            )}
          </>
        )}

        <Text style={styles.text}>Select AM/PM:</Text>
        {Platform.OS === 'web' ? (
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            style={styles.webDropdown}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowAmPmPicker(!showAmPmPicker)} style={styles.input}>
              <Text style={styles.text}>{timeSlot ? timeSlot : 'Select AM/PM'}</Text>
            </TouchableOpacity>
            {showAmPmPicker && (
              <Modal transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                  <Button title="Close" onPress={() => setShowAmPmPicker(false)} />
                  <Picker
                    selectedValue={timeSlot}
                    onValueChange={(itemValue) => setTimeSlot(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="AM" value="AM" />
                    <Picker.Item label="PM" value="PM" />
                  </Picker>
                </View>
              </Modal>
            )}
          </>
        )}

        <Text style={styles.text}>Select Pickup/Delivery Time:</Text>
        {Platform.OS === 'web' ? (
          <select
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            style={styles.webDropdown}
          >
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowTimePicker(!showTimePicker)} style={styles.input}>
              <Text style={styles.text}>{pickupTime ? pickupTime : 'Select Time'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <Modal transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                  <Button title="Close" onPress={() => setShowTimePicker(false)} />
                  <Picker
                    selectedValue={pickupTime}
                    onValueChange={(itemValue) => setPickupTime(itemValue)}
                    style={styles.picker}
                  >
                    {availableTimes.map((time, index) => (
                      <Picker.Item key={index} label={time} value={time} />
                    ))}
                  </Picker>
                </View>
              </Modal>
            )}
          </>
        )}
        <View style={styles.buttonContainer}>
        <Button title="Place Order" onPress={handleOrder} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Ensure the button stays at the bottom
    padding: 16,
    backgroundColor: '#313338',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#313338',
    paddingBottom: 80, // Add padding to accommodate the button
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5, // Increased margin for spacing
    borderRadius: 5,
    color: '#fff',
  },
  inputError: {
    borderColor: '#f9412c',
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
  errorText: {
    color: '#f9412c',
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20, // Space between last input and button
    marginBottom: 16, // Padding from the bottom
  },
  webDropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginVertical: 15,
    borderRadius: 5,
    color: '#000',
    backgroundColor: '#fff',
  },
});



export default Checkout;
