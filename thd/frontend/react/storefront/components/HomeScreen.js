// components/HomeScreen.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { signIn, signInGuest, setGlobalState } from '../config/apiConfig';
import './HomeScreen.css'; // Optional: For additional custom styles

const HomeScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const history = useHistory();

  const handleSignIn = async () => {
    try {
      const login = await signIn(email, password);
      setGlobalState('username', email);
      console.log('API Response:', login);
    } catch (error) {
      console.error('API Error:', error.message);
      setError(error.message);
      setShowError(true);
    }

    history.push('/confirm');
    setGlobalState('isLoggedIn', true);
  };

  const handleSignInGuest = async () => {
    try {
      const login = await signInGuest();
      setGlobalState('username', 'Guest');
      console.log('API Response:', login);
    } catch (error) {
      console.error('API Error:', error.message);
      setError(error.message);
      setShowError(true);
    }

    history.push('/confirm');
    setGlobalState('isLoggedIn', true);
  };

  return (
    <div className="container text-center text-white mt-5">
      <img
        src={require('../assets/applogo.jpg')}
        className="img-fluid mb-4"
        alt="App Logo"
      />
      <h1 className="mb-4">Sign In</h1>
      {showError && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}
      <input
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <input
        className="form-control mb-3"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button className="btn btn-primary btn-block mb-2" onClick={handleSignIn}>Submit</button>
      <button className="btn btn-secondary btn-block mb-2" onClick={() => history.push('/register')}>Register</button>
      <button className="btn btn-link text-success" onClick={handleSignInGuest}>Continue as Guest</button>
    </div>
  );
};

export default HomeScreen;