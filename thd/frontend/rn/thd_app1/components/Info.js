// frontend/screens/Profile.js

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';

export default function Info({ navigation }) {
  const [isOrdersCollapsed, setIsOrdersCollapsed] = useState(true);
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);

  const toggleOrdersCollapsed = () => {
    setIsOrdersCollapsed(!isOrdersCollapsed);
  };

  const toggleSettingsCollapsed = () => {
    setIsSettingsCollapsed(!isSettingsCollapsed);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      <View style={styles.userInfo}>
        <Text>Username: John Doe</Text>
        <Text>Email: john.doe@example.com</Text>
        <Text>Phone: *******7890</Text>
      </View>

      <TouchableOpacity onPress={toggleOrdersCollapsed} style={styles.collapsibleHeader}>
        <Text style={styles.collapsibleHeaderText}>User Orders</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isOrdersCollapsed}>
        <View style={styles.collapsibleContent}>
          <Text>Order #1</Text>
          <Text>Order #2</Text>
          <Text>Order #3</Text>
        </View>
      </Collapsible>

      <TouchableOpacity onPress={toggleSettingsCollapsed} style={styles.collapsibleHeader}>
        <Text style={styles.collapsibleHeaderText}>Settings</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isSettingsCollapsed}>
        <View style={styles.collapsibleContent}>
          <View style={styles.settingsItem}>
            <Text>Enable Notifications</Text>
            <Switch value={true} onValueChange={() => {}} />
          </View>
          <View style={styles.settingsItem}>
            <Text>Dark Mode</Text>
            <Switch value={false} onValueChange={() => {}} />
          </View>
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  collapsibleHeader: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 5,
  },
  collapsibleHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
