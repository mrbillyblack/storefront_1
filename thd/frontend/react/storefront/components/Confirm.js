// components/Confirm.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import './Confirm.css'; // Import the custom CSS file

const Confirm = () => {
  const history = useHistory();
  const phoneNumber = '(646)960-4716'; // Replace with your phone number

  const handleContactPress = () => {
    const url = `sms:${phoneNumber}`;
    window.open(url, '_blank').catch((err) => console.error('Error:', err));
  };

  return (
    <Container className="confirm-container text-center">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Image 
            src="/path/to/your/image/applogo.jpg" // Adjust the path accordingly
            alt="App Logo"
            className="confirm-image"
            fluid
          />
          <p className="text-white mt-3">You're logged in!</p>
          <p className="text-white">Use the navigation menu to go to the shop.</p>
          <div className="contact-button-container">
            <Button variant="primary" onClick={handleContactPress}>
              Contact
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Confirm;
```

### Confirm.css
```css
.confirm-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #313338;
  min-height: 100vh;
  padding: 16px;
}

.confirm-image {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.contact-button-container {
  position: absolute;
  bottom: 20px;
  width: 100%;
  padding: 0 16px;
}