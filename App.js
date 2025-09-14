// App.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginForm from './src/components/Auth/LoginForm';
import Header from './src/components/Layout/Header';
import AdminDashboard from './src/components/Dashboard/AdminDashboard';
import DriverDashboard from './src/components/Dashboard/DriverDashboard';
import UserDashboard from './src/components/Dashboard/UserDashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'super_admin':
      case 'admin':
        return <AdminDashboard />;
      case 'driver':
        return <DriverDashboard />;
      case 'user':
        return <UserDashboard />;
      default:
        return (
          <View style={styles.unknownContainer}>
            <Text style={styles.unknownTitle}>Unknown Role</Text>
            <Text style={styles.unknownText}>Please contact your administrator.</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.main}>
        {renderDashboard()}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  main: {
    padding: 16,
  },
  unknownContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  unknownTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  unknownText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
