import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

const OrderConfirmation = () => {
  const location = useLocation();
  const history = useHistory();
  const data = location.state;

  const handleGoToMenu = () => {
    history.push('/menu'); // Assume Menu is the main screen
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Card>
            <Card.Header className="text-center bg-dark text-white">
              Order Confirmed
            </Card.Header>
            <Card.Body className="bg-dark text-white">
              <h5 className="text-center mb-3">Screenshot this page</h5>
              <Row className="mb-3">
                <Col>
                  <strong>Name:</strong>
                </Col>
                <Col>{data.name}</Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Phone:</strong>
                </Col>
                <Col>{data.phone}</Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Address:</strong>
                </Col>
                <Col>{data.address}</Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Order Type:</strong>
                </Col>
                <Col>{data.pickup ? 'Pickup' : 'Delivery'}</Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Scheduled Time:</strong>
                </Col>
                <Col>{`${data.scheduledTime.slice(0, 15)}${data.scheduledTime.slice(33)}`}</Col>
              </Row>
              <h5 className="text-center mb-3">Cart Items</h5>
              {Object.keys(data.cart).map((key) => {
                const item = data.cart[key];
                return (
                  <Row key={item.id} className="mb-3">
                    <Col>
                      <strong>{item.name}</strong>
                    </Col>
                    <Col>Price: ${item.price}</Col>
                    <Col>Qty: 3.5g x {item.quantity}</Col>
                  </Row>
                );
              })}
              <Row className="mb-3">
                <Col>
                  <strong>Total Cost:</strong>
                </Col>
                <Col>${data.cartTotal.toFixed(2)}</Col>
              </Row>
              <div className="text-center">
                <Button variant="primary" onClick={handleGoToMenu} style={{ backgroundColor: '#b74b28' }}>
                  Back to Menu
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;
