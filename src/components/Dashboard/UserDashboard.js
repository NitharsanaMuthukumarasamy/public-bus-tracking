// UserDashboard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { Search, MapPin, Clock, Bus as BusIcon, Navigation, Phone, AlertTriangle } from 'lucide-react-native';

// Mock data (replace with your own data or API)
const mockBuses = [
  {
    id: 1,
    number: 'LSS5',
    route: 'Station - Market',
    status: 'active',
    driver: 'Ramesh',
    stops: [
      { id: 1, name: 'Station', estimatedArrival: '5 mins', distance: 1.2 },
      { id: 2, name: 'Market', estimatedArrival: '15 mins', distance: 5.8 },
    ],
  },
];

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); // search | stops | track

  const filteredBuses = mockBuses.filter(
    (bus) =>
      bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bus Tracker</Text>
      <Text style={styles.subtitle}>
        Find your bus, track location, and get real-time updates
      </Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['search', 'stops', 'track'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <View style={styles.card}>
          <TextInput
            placeholder="Search bus number or route..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.input}
          />
          {filteredBuses.map((bus) => (
            <View key={bus.id} style={styles.busCard}>
              <Text style={styles.busNumber}>{bus.number}</Text>
              <Text>{bus.route}</Text>
              <Text>Status: {bus.status}</Text>
              <Text>Driver: {bus.driver}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedBus(bus);
                  setActiveTab('track');
                }}
                style={styles.trackButton}
              >
                <Text style={styles.trackButtonText}>Track Bus</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Track Tab */}
      {activeTab === 'track' && selectedBus && (
        <View style={styles.card}>
          <Text style={styles.busNumber}>Tracking Bus {selectedBus.number}</Text>
          <Text>{selectedBus.route}</Text>
          <Text>Status: {selectedBus.status}</Text>
          <Text>Driver: {selectedBus.driver}</Text>
          <View style={styles.stopsContainer}>
            {selectedBus.stops.map((stop) => (
              <View key={stop.id} style={styles.stopCard}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text>ETA: {stop.estimatedArrival}</Text>
                <Text>{stop.distance} km away</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Call Support */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => Alert.alert('Calling Support...')}
      >
        <Phone color="white" size={24} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 16 },
  tabContainer: { flexDirection: 'row', marginBottom: 12 },
  tabButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  activeTabButton: { backgroundColor: '#007bff' },
  tabText: { color: '#555' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  busCard: { marginBottom: 12, padding: 12, backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#ddd' },
  busNumber: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  trackButton: {
    marginTop: 8,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
  },
  trackButtonText: { color: '#fff', textAlign: 'center' },
  stopsContainer: { marginTop: 12 },
  stopCard: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  stopName: { fontWeight: 'bold' },
  callButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 50,
  },
});
