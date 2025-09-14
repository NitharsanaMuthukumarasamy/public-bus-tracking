// screens/BusMap.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../context/AuthContext';

export default function BusMap() {
  const { buses } = useAuth();

  if (!buses || buses.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No buses available</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: buses[0].currentLocation.lat,
    longitude: buses[0].currentLocation.lng,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      {buses.map(bus => (
        <Marker
          key={bus.id}
          coordinate={{ latitude: bus.currentLocation.lat, longitude: bus.currentLocation.lng }}
          title={`Bus ${bus.number}`}
          description={`Status: ${bus.status}`}
          pinColor={bus.status === 'active' ? 'green' : bus.status === 'traffic' ? 'orange' : 'red'}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
