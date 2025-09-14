import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  TextInput, 
  StyleSheet, 
  FlatList,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../context/AuthContext';
//import { mockBuses } from '../../data/mockData';
// import BusMap from '../Map/BusMap'; // Replace with a React Native map component (e.g. react-native-maps)

export default function DriverDashboard() {
  const { user } = useAuth();
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlertForm, setShowAlertForm] = useState(false);

  // Find driver’s bus
  const driverBus = mockBuses.find(bus => bus.driverId === user?.id);

  if (!driverBus) {
    return (
      <View style={styles.centered}>
        <Icon name="alert-triangle" size={50} color="orange" />
        <Text style={styles.title}>No Bus Assigned</Text>
        <Text style={styles.subtitle}>
          Please contact your administrator to assign a bus to your account.
        </Text>
      </View>
    );
  }

  const handleSendAlert = () => {
    if (!alertType || !alertMessage.trim()) return;

    console.log('Sending alert:', { type: alertType, message: alertMessage, busId: driverBus.id });
    setAlertType('');
    setAlertMessage('');
    setShowAlertForm(false);

    Alert.alert('Success', 'Alert sent successfully to Admin and Users!');
  };

  const stats = {
    nextStop: driverBus.stops[0],
    totalStops: driverBus.stops.length,
    passengersNotified: 45, // Mock
    onTime: driverBus.status === 'active',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Driver Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.btnWarning} onPress={() => setShowAlertForm(true)}>
          <Icon name="alert-triangle" size={18} color="#fff" />
          <Text style={styles.btnText}> Send Alert</Text>
        </TouchableOpacity>
      </View>

      {/* Bus Information */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>Bus {driverBus.number}</Text>
            <Text style={styles.subtitle}>{driverBus.route}</Text>
          </View>
          <Text style={[
            styles.badge,
            driverBus.status === 'active' ? styles.badgeSuccess :
            driverBus.status === 'traffic' ? styles.badgeWarning :
            styles.badgeDanger
          ]}>
            {driverBus.status === 'active' ? 'On Schedule' :
             driverBus.status === 'traffic' ? 'Delayed' : 'Issues'}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Icon name="navigation" size={20} color="blue" />
            <Text style={styles.statLabel}>Next Stop</Text>
            <Text style={styles.statValue}>{stats.nextStop?.name}</Text>
            <Text style={styles.statSmall}>{stats.nextStop?.estimatedArrival}</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="clock" size={20} color="green" />
            <Text style={styles.statLabel}>Total Stops</Text>
            <Text style={styles.statValue}>{stats.totalStops}</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="users" size={20} color="purple" />
            <Text style={styles.statLabel}>Users Notified</Text>
            <Text style={styles.statValue}>{stats.passengersNotified}</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="alert-triangle" size={20} color="orange" />
            <Text style={styles.statLabel}>Status</Text>
            <Text style={styles.statValue}>{stats.onTime ? 'On Time' : 'Delayed'}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.btnWarning} onPress={() => { setAlertType('traffic'); setShowAlertForm(true); }}>
          <Icon name="alert-triangle" size={18} color="#fff" />
          <Text style={styles.btnText}> Report Traffic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDanger} onPress={() => { setAlertType('breakdown'); setShowAlertForm(true); }}>
          <Icon name="alert-triangle" size={18} color="#fff" />
          <Text style={styles.btnText}> Report Breakdown</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDanger} onPress={() => { setAlertType('accident'); setShowAlertForm(true); }}>
          <Icon name="alert-triangle" size={18} color="#fff" />
          <Text style={styles.btnText}> Report Accident</Text>
        </TouchableOpacity>
      </View>

      {/* Next Stops */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Stops</Text>
        <FlatList
          data={driverBus.stops.slice(0, 3)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.subtitle}>{item.name}</Text>
                <Text style={styles.small}>{item.distance?.toFixed(1)} km</Text>
              </View>
              <View>
                <Text style={styles.small}>{item.estimatedArrival}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Map placeholder */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Bus Location (Map here)</Text>
        {/* Replace with react-native-maps */}
        <View style={{ height: 200, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Map Placeholder</Text>
        </View>
      </View>

      {/* Alert Form Modal */}
      <Modal visible={showAlertForm} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>Send Alert</Text>
              <TouchableOpacity onPress={() => setShowAlertForm(false)}>
                <Text style={{ fontSize: 18, color: 'gray' }}>×</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Alert Type (traffic, breakdown, accident)"
              value={alertType}
              onChangeText={setAlertType}
              style={styles.input}
            />
            <TextInput
              placeholder="Describe the situation..."
              value={alertMessage}
              onChangeText={setAlertMessage}
              style={[styles.input, { height: 80 }]}
              multiline
            />
            <View style={styles.rowBetween}>
              <TouchableOpacity style={styles.btnSecondary} onPress={() => setShowAlertForm(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnDanger} 
                onPress={handleSendAlert}
                disabled={!alertType || !alertMessage.trim()}
              >
                <Text style={styles.btnText}>Send Alert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 14, color: 'gray' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { padding: 6, borderRadius: 6, color: '#fff' },
  badgeSuccess: { backgroundColor: 'green' },
  badgeWarning: { backgroundColor: 'orange' },
  badgeDanger: { backgroundColor: 'red' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { width: '45%', padding: 8, marginBottom: 8, backgroundColor: '#eee', borderRadius: 8, alignItems: 'center' },
  statLabel: { fontSize: 12, color: 'gray' },
  statValue: { fontSize: 14, fontWeight: 'bold' },
  statSmall: { fontSize: 12, color: 'blue' },
  btnWarning: { flexDirection: 'row', backgroundColor: 'orange', padding: 10, borderRadius: 6, marginVertical: 4, alignItems: 'center', justifyContent: 'center' },
  btnDanger: { flexDirection: 'row', backgroundColor: 'red', padding: 10, borderRadius: 6, marginVertical: 4, alignItems: 'center', justifyContent: 'center' },
  btnSecondary: { flexDirection: 'row', backgroundColor: 'gray', padding: 10, borderRadius: 6, marginVertical: 4, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 10 }
});
