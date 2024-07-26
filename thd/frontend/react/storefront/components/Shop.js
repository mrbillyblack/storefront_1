import React, { useState, useEffect } from 'react';
import { getMenu } from '../config/apiConfig';
import { useHistory } from 'react-router-dom';
import './Shop.css'; // Optional: For additional custom styles

const Shop = () => {
  const [tempCart, setTempCart] = useState({});
  const [cart, setCart] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [showCartDetails, setShowCartDetails] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getMenu();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchItems();
  }, []);

  const selectItem = (id, change) => {
    setTempCart((prevTempCart) => {
      const quantity = (prevTempCart[id]?.quantity || 0) + change;
      if (quantity < 0) return prevTempCart;
      return { ...prevTempCart, [id]: { ...menuItems.find(item => item.id === id), quantity } };
    });
  };

  const add2Cart = () => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      for (const id in tempCart) {
        const existingQuantity = prevCart[id]?.quantity || 0;
        updatedCart[id] = { ...tempCart[id], quantity: existingQuantity + tempCart[id].quantity };
      }
      console.log(updatedCart);
      return updatedCart;
    });
    setTempCart({});
  };

  const updateCart = (id, change) => {
    setCart((prevCart) => {
      const newQuantity = (prevCart[id]?.quantity || 0) + change;
      if (newQuantity <= 0) {
        const { [id]: _, ...rest } = prevCart;
        return rest;
      }
      return { ...prevCart, [id]: { ...prevCart[id], quantity: newQuantity } };
    });
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const toCheckout = () => {
    history.push('/checkout');
  };

  return (
    <div className="container mt-5 text-white">
      <h1 className="mb-4">Shop</h1>
      <div className="list-group mb-4">
        {menuItems.map(item => (
          <div key={item.id} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
            <span>{item.name}</span>
            <span>${item.price}</span>
            <div>
              <button className="btn btn-secondary btn-sm mx-2" onClick={() => selectItem(item.id, -1)}>-</button>
              <span>{tempCart[item.id]?.quantity || 0}</span>
              <button className="btn btn-secondary btn-sm mx-2" onClick={() => selectItem(item.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-block mb-2" onClick={add2Cart}>Add to Cart</button>
      <button className="btn btn-success btn-block mb-2" onClick={toCheckout}>Checkout</button>
      <div className="mt-4">
        <h2>Total: ${calculateTotal()}</h2>
        <button className="btn btn-link text-success" onClick={() => setShowCartDetails(!showCartDetails)}>
          {showCartDetails ? 'Hide Cart Details' : 'View Cart Details'}
        </button>
        {showCartDetails && (
          <div className="list-group mt-3">
            {Object.values(cart).map(item => (
              <div key={item.id} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
                <span>{item.name}</span>
                <div>
                  <button className="btn btn-secondary btn-sm mx-2" onClick={() => updateCart(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="btn btn-secondary btn-sm mx-2" onClick={() => updateCart(item.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
