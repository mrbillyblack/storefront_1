import React, { useState, useEffect } from 'react';
import { Alert, View, Text, Pressable, FlatList, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { getMenu } from '../config/apiConfig';

// Conditional imports or component adjustments may be needed for web
import { Dropdown } from 'react-native-web'; // Import Dropdown for web

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
      return updatedCart;
    });
    setTempCart({});
  };

  const updateCart = (id, change) => {
    setCart((prevCart) => {
      const newQuantity = (prevCart[id]?.quantity || 0) + change;

      if (newQuantity <= 0) {
        const updatedCart = { ...prevCart };
        delete updatedCart[id];
        return updatedCart;
      }

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

  const DropdownComponent = Platform.OS === 'web' ? Dropdown : TouchableOpacity;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today's Selection</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <FlatList
          scrollEnabled={false}
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => selectItem(item.id, -1)} style={styles.stepperButton}>
                  <Text style={styles.stepperButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{tempCart[item.id]?.quantity || 0}</Text>
                <TouchableOpacity onPress={() => selectItem(item.id, 1)} style={styles.stepperButton}>
                  <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalText}>${cartTotal}</Text>
        </View>
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setShowCartDetails(!showCartDetails)}>
          <Text style={styles.viewCartText}>{showCartDetails ? 'Hide cart details' : 'Show cart details'}</Text>
        </TouchableOpacity>
        {showCartDetails && (
          <View style={styles.cartSummary}>
            {Object.keys(cart).map((itemId) => (
              <View key={itemId} style={styles.cartItem}>
                <Text style={styles.cartItemName}>{menuItems.find((item) => item.id === itemId)?.name}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => updateCart(itemId, -1)} style={styles.stepperButton}>
                    <Text style={styles.stepperButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{cart[itemId].quantity}</Text>
                  <TouchableOpacity onPress={() => updateCart(itemId, 1)} style={styles.stepperButton}>
                    <Text style={styles.stepperButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryAction} onPress={add2Cart}>
            <Text style={styles.secondaryActionText}>Add to Cart</Text>
          </Pressable>
          <Pressable style={styles.primaryAction} onPress={toCheckout}>
            <Text style={styles.primaryActionText}>Checkout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1f2125',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  scrollView: {
    flexGrow: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2b2e33',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#9aa0a6',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a3d43',
    borderRadius: 8,
  },
  stepperButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  quantityText: {
    fontSize: 16,
    color: 'white',
    marginHorizontal: 14,
    minWidth: 18,
    textAlign: 'center',
  },
  footer: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3a3d43',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 15,
    color: '#b6bac1',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  expandButton: {
    marginBottom: 8,
  },
  viewCartText: {
    color: '#e08a5f',
    fontSize: 14,
    fontWeight: '600',
  },
  cartSummary: {
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cartItemName: {
    color: 'white',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#494d54',
  },
  secondaryActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  primaryAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#b74b28',
  },
  primaryActionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default Shop;
