// components/Shop.js
import React, { useState, useEffect } from 'react';
import { getMenu } from '../config/apiConfig';
import { Alert, View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';


// const inventory = [
//   { id: '1', name: 'Item 1', price: 10 },
//   { id: '2', name: 'Item 2', price: 20 },
//   // Add more items as needed
// ];


const Shop = ({ navigation }) => {
  const [tempCart, setTempCart] = useState({}); 
  const [cart, setCart] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [showCartDetails, setShowCartDetails] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
        try {
            const data = await getMenu();
            setMenuItems(data);
        } catch (error) {
            // Handle errors (e.g., show error message)
            console.error('Error fetching menu items:', error);
        }
    };

    fetchItems();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

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
      // Calculate new quantity
      const newQuantity = (prevCart[id]?.quantity || 0) + change;
  
      // If quantity drops to 0 or below, remove the item from the cart
      if (newQuantity <= 0) {
        const updatedCart = { ...prevCart };
        delete updatedCart[id];
        return updatedCart;
      }
  
      // Otherwise, update the quantity of the item in the cart
      return {
        ...prevCart,
        [id]: {
          ...menuItems.find((item) => item.id === id),
          quantity: newQuantity,
        },
      };
    });
  };

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const toCheckout = () => {
    if (isEmpty(cart)) {
      Alert.alert('Add items to the cart.');
      return;
    }
    navigation.navigate('Checkout', { cart, cartTotal }); 
    setCart({});
  };

  const cartTotal = Object.values(cart).reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => selectItem(item.id, -1)} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{tempCart[item.id]?.quantity || 0}</Text>
              <TouchableOpacity onPress={() => selectItem(item.id, 1)} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${cartTotal}</Text>
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setShowCartDetails(!showCartDetails)}>
          <Text style={styles.viewCartText}>{showCartDetails ? 'Hide Cart Details' : 'Show Cart Details'}</Text>
        </TouchableOpacity>
        {showCartDetails && (
          <View style={styles.cartSummary}>
            {Object.keys(cart).map((itemId) => (
              <View key={itemId} style={styles.cartItem}>
                <Text style={styles.cartItemName}>{menuItems.find((item) => item.id === itemId)?.name}:</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => updateCart(itemId, -1)} style={styles.button}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{cart[itemId].quantity}</Text>
                  <TouchableOpacity onPress={() => updateCart(itemId, 1)} style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        <Button style={{padding: 12}} title="Add to Cart" onPress={add2Cart} />
        <Button title="Checkout" onPress={toCheckout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#313338', // Dark mode background color
    color: 'white',
    borderBlockEndColor: '#212121',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    color: 'white', // White text color
  },
  itemPrice: {
    fontSize: 16,
    color: '#ccc', // Lighter text color for price
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: { 
    marginHorizontal: 10, 
    padding: 7, 
    backgroundColor: '#ddd', 
    borderRadius: 5 
  },
  buttonText: {
    fontSize: 10,
  },
  quantityText: {
    fontSize: 16,
    color: 'white', // White text color for quantity
    marginHorizontal: 10,
  },
  footer: {
    marginTop: 10,
    borderTopWidth: 10,
    paddingTop: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', // White text color for total
    marginBottom: 10,
  },
  expandButton: {
    marginTop: 10,
  },
  viewCartText: {
    color: 'green',
    textDecorationLine: 'underline',
    marginBottom: 12,
    font: 14,
  },
  cartSummary: {
    marginTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cartItemName: {
    color: 'white', // White text color for cart item names
    fontSize: 14,
  },
});

export default Shop;