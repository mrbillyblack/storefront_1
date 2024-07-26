// components/Confirm.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { signUp } from '../config/apiConfig';
import { Alert, Button, Form, Container, Row, Col } from 'react-bootstrap';
import './Register.css'; // Import the custom CSS file

export default function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);

  const history = useHistory();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const signup = await signUp(email, password, userName);
      console.log('API Response:', signup);
      console.log('email: ', email);
      console.log('pass: ', password);

      setErrorMsg('');
      setShowError(false);
      Alert('Registration successful!');
      history.push('/login');
    } catch (error) {
      console.error('API Error:', error.message);
      setErrorMsg(error.message);
      setShowError(true);
    }
  };

  return (
    <Container className="register-container">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1 className="title text-center">Sign Up</h1>
          {showError && (
            <Alert variant="danger">
              Error: {errorMsg}
            </Alert>
          )}
          <Form onSubmit={handleSignUp}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter username" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}