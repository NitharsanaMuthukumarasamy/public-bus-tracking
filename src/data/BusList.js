// screens/BusList.js
import React, { useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function BusList() {
  const { buses, addBus } = useAuth();
  const [busNumber, setBusNumber] = useState('');
  const navigation = useNavigation();

  const handleAddBus = async () => {
    if (busNumber.trim()) {
      await addBus(busNumber.trim());
      setBusNumber('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buses</Text>
      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.busCard}>
            <Text>Bus Number: {item.number}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />

      <TextInput
        placeholder="Bus Number"
        value={busNumber}
        onChangeText={setBusNumber}
        style={styles.input}
      />
      <Button title="Add Bus" onPress={handleAddBus} />

      <Button title="View on Map" onPress={() => navigation.navigate('BusMap')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  busCard: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 8, borderRadius: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 6 },
});
