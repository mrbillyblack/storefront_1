// frontend/config/apiConfig.js
import { createGlobalState } from 'react-hooks-global-state';


const API_URL = 'http://172.20.0.10:5000/api';  // Replace with your actual FastAPI backend URL


const {setGlobalState, useGlobalState} = createGlobalState({
  username: 'Guest',
  userID: '',
  isLoggedIn: false,
});

const signUp = async (email, password, username) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally, include authorization headers if needed
          // 'Authorization': 'Bearer your-access-token',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(JSON.stringify({ email, password }));

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Created Item:', data);
      return data;
      
      // Optionally handle success (e.g., show success message)
    } catch (error) {
      console.error('API Error (Sign Up):', error);
      // Handle error
    }
  };

const signIn = async (email, password) => {
    console.log()
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally, include authorization headers if needed
          // 'Authorization': 'Bearer your-access-token',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Created Item:', data);


      return data;
      
      // Optionally handle success (e.g., show success message)
    } catch (error) {
      console.error('API Error (Sign In):', error);
      // Handle error
    }


  };

  const signInGuest = async () => {
    console.log()
    try {
      const response = await fetch(`${API_URL}/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally, include authorization headers if needed
          // 'Authorization': 'Bearer your-access-token',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Created Item:', data);

      setGlobalState('isLoggedIn', true);

      

      return data;
      
      // Optionally handle success (e.g., show success message)
    } catch (error) {
      console.error('API Error (Sign In):', error);
      // Handle error
    }


  };

const signOut = async () => {
    try {
      const response = await fetch(`${API_URL}/signout`, {
        headers: {
          'Content-Type': 'application/json',
          // Optionally, include authorization headers if needed
          // 'Authorization': 'Bearer your-access-token',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Created Item:', data);
      
      // Optionally handle success (e.g., show success message)
    } catch (error) {
      console.error('API Error (Sign Up):', error);
      // Handle error
    }
  };

  const getMenu = async () => {
    try {
      const response = await fetch(`${API_URL}/menu`);
      if (!response.ok) {
        throw new Error('Error fetching inventory');
      }
      data = await response.json();
      console.log(data);
      return data;
      

    } catch (error) {
      console.error('Fetch inventory error:', error);
      throw error;
    }
  };

  const placeOrder = async (data) => {
    let pl = JSON.stringify(data)
    
    try {
      
      const response = await fetch(`${API_URL}/placeOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally, include authorization headers if needed
          // 'Authorization': 'Bearer your-access-token',
        },
        body: pl,
      });


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response;
      console.log('Created Item:', data);

      return data;
      
      // Optionally handle success (e.g., show success message)
    } catch (error) {
      console.error('API Error (Place Order):', error);
      // Handle error
    }
  };

export {
  API_URL,
  getMenu,
  placeOrder,
  setGlobalState,
  signUp,  
  signIn,
  signInGuest,
  signOut,
  useGlobalState,
};

