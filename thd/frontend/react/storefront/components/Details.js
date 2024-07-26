// components/Details.js

import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { placeOrder } from '../config/apiConfig';

const Details = () => {
  const history = useHistory();
  const location = useLocation();
  const data = location.state || {};
  console.log(`passed cart ${data.cart}`);

  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);

  const handleConfirmOrder = async () => {
    try {
      const response = await placeOrder(data);
      console.log('API Response:', response);
      history.push('/order-confirm', data);
    } catch (error) {
      console.error('API Error:', error.message);
      setErrorMsg(error.message);
      setShowError(true);
    }
    setErrorMsg('');
    setShowError(false);
  };

  return (
    <Container className="mt-5" style={{ backgroundColor: '#313338', padding: '16px', borderRadius: '8px' }}>
      <h2 className="text-center text-light mb-4">Order Summary</h2>
      {showError && <Alert variant="danger">{errorMsg}</Alert>}
      <Row className="mb-2">
        <Col md={4} className="text-light font-weight-bold">Name:</Col>
        <Col md={8} className="text-light">{data.name}</Col>
      </Row>
      <Row className="mb-2">
        <Col md={4} className="text-light font-weight-bold">Phone:</Col>
        <Col md={8} className="text-light">{data.phone}</Col>
      </Row>
      <Row className="mb-2">
        <Col md={4} className="text-light font-weight-bold">Address:</Col>
        <Col md={8} className="text-light">{data.address}</Col>
      </Row>
      <Row className="mb-2">
        <Col md={4} className="text-light font-weight-bold">Order Type:</Col>
        <Col md={8} className="text-light">{data.pickup ? 'Pickup' : 'Delivery'}</Col>
      </Row>
      <Row className="mb-2">
        <Col md={4} className="text-light font-weight-bold">Scheduled Time:</Col>
        <Col md={8} className="text-light">{`${data.scheduledTime.slice(0, 15)}${data.scheduledTime.slice(33)}`}</Col>
      </Row>
      <div className="mt-4">
        <h4 className="text-light mb-3">Cart Items</h4>
        {Object.keys(data.cart).map(key => {
          const item = data.cart[key];
          return (
            <Row key={item.id} className="mb-2 text-light">
              <Col md={6}>{item.name}</Col>
              <Col md={3}>Price: ${item.price}</Col>
              <Col md={3}>Qty: 3.5 x {item.quantity}</Col>
            </Row>
          );
        })}
      </div>
      <Row className="mt-3 mb-4">
        <Col md={4} className="text-light font-weight-bold">Total Cost:</Col>
        <Col md={8} className="text-light">${data.cartTotal.toFixed(2)}</Col>
      </Row>
      <Button variant="danger" onClick={handleConfirmOrder}>Confirm Order</Button>
    </Container>
  );
};

export default Details;
