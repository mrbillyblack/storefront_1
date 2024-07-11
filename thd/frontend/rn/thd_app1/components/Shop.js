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

  //don't use this line
  //const selectedTotal = Object.values(selected).reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const add2Cart = () => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      for (const id in tempCart) {
        const existingQuantity = prevCart[id]?.quantity || 0;
        updatedCart[id] = { ...tempCart[id], quantity: existingQuantity + tempCart[id].quantity };
      }
      return updatedCart;
    });
    setTempCart({});
  };

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }

  const toCheckout = () => {
    if (isEmpty(cart)) {
      Alert.alert('Add items to the cart.');
      return;
    }
    navigation.navigate('Checkout', { cart }); 
  };

  const cartTotal = Object.values(cart).reduce((sum, item) => sum + (item.quantity * item.price), 0);

  

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => selectItem(item.id, -1)} style={styles.button}>
                <Text>-</Text>
              </TouchableOpacity>
              <Text>{tempCart[item.id]?.quantity || 0}</Text>
              <TouchableOpacity onPress={() => selectItem(item.id, 1)} style={styles.button}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text>Total: ${cartTotal}</Text>
        <Button title="Add to Cart" onPress={() => add2Cart() } />
        <Button title="Checkout" onPress={() => toCheckout()} />
      </View>
    </View>
    
  );


};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  button: { marginHorizontal: 10, padding: 5, backgroundColor: '#ddd', borderRadius: 5 },
  footer: { padding: 10, borderTopWidth: 1, borderColor: '#ddd' }
});

export default Shop;
