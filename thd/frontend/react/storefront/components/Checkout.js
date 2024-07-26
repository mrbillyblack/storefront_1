import React, { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { placeOrder, useGlobalState } from '../config/apiConfig';
import './Checkout.css'; // Optional: For additional custom styles

const generateNextDays = (numDays) => {
  const days = [];
  for (let i = 0; i < numDays; i++) {
    days.push(addDays(new Date(), i));
  }
  return days;
};

const Checkout = () => {
  const nextDays = generateNextDays(3);
  const history = useHistory();
  const location = useLocation();
  const { cart = [], cartTotal } = location.state || {};

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isPickup, setPickup] = useState('delivery');
  const [pickupDay, setPickupDay] = useState(nextDays[0]);
  const [pickupTime, setPickupTime] = useState('');
  const [timeSlot, setTimeSlot] = useState('AM');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAmPmPicker, setShowAmPmPicker] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);

  const username = useGlobalState('username');
  const isLoggedIn = useGlobalState('isLoggedIn');

  const amTimes = [...Array(12).keys()].map(i => `${i === 0 ? 12 : i}:00 AM`);
  const pmTimes = [...Array(12).keys()].map(i => `${i === 0 ? 12 : i}:00 PM`);

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
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhone = (text) => {
    const formattedPhoneNumber = formatPhoneNumber(text);
    setPhone(formattedPhoneNumber);
  };

  const handleOrder = async () => {
    if (!name || !phone || !pickupDay || !pickupTime) {
      alert('Please fill out all fields');
      return;
    }

    const scheduledTime = `${format(pickupDay, 'eeee, MMM d')} ${pickupTime}`;
    let pkup = isPickup === 'pickup';

    if (!phoneValid) {
      alert('Enter a valid phone number.');
      return;
    }

    if (username === 'Guest') {
      setName(`${name} (Guest)`);
    } else {
      setName(username);
    }

    const data = {
      name,
      phone,
      address,
      pickup: pkup,
      scheduledTime,
      cart,
      cartTotal,
    };

    history.push('/details', data);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h3 className="text-center mb-4">Enter your details:</h3>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => handlePhone(e.target.value)}
                isInvalid={!phoneValid}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid phone number.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formAddress" className="mt-3">
              <Form.Label>Address (leave blank if pickup)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPickupDay" className="mt-3">
              <Form.Label>Pickup/Delivery Day</Form.Label>
              <Form.Control
                as="select"
                value={pickupDay}
                onChange={(e) => setPickupDay(e.target.value)}
              >
                {nextDays.map((day, index) => (
                  <option key={index} value={day}>
                    {format(day, 'eeee, MMM d')}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTimeSlot" className="mt-3">
              <Form.Label>AM/PM</Form.Label>
              <Form.Control
                as="select"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formPickupTime" className="mt-3">
              <Form.Label>Pickup/Delivery Time</Form.Label>
              <Form.Control
                as="select"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              >
                {availableTimes.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formPickupOrDelivery" className="mt-3">
              <Form.Label>Pickup or Delivery</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Pickup"
                  name="pickupOrDelivery"
                  value="pickup"
                  checked={isPickup === 'pickup'}
                  onChange={(e) => setPickup(e.target.value)}
                  inline
                />
                <Form.Check
                  type="radio"
                  label="Delivery"
                  name="pickupOrDelivery"
                  value="delivery"
                  checked={isPickup === 'delivery'}
                  onChange={(e) => setPickup(e.target.value)}
                  inline
                />
              </div>
            </Form.Group>

            <Button className="mt-4" variant="primary" onClick={handleOrder}>
              Place Order
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
