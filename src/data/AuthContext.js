// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const superAdmin = {
  id: '1',
  name: 'Super Admin',
  email: 'superadmin@bustrack.com',
  password: 'admin123',
  role: 'super_admin',
  createdAt: new Date(),
};

const initialUsers = [
  { id: '4', name: 'Regular User', email: 'user@bustrack.com', password: 'user123', role: 'user', createdAt: new Date() },
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([superAdmin, ...initialUsers]);
  const [buses, setBuses] = useState([]);
  const [assignments, setAssignments] = useState([]); // daily driver-bus mapping
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('bustrack_user');
        const savedUsers = await AsyncStorage.getItem('bustrack_users');
        const savedBuses = await AsyncStorage.getItem('bustrack_buses');
        const savedAssignments = await AsyncStorage.getItem('bustrack_assignments');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedUsers) setUsers(JSON.parse(savedUsers));
        if (savedBuses) setBuses(JSON.parse(savedBuses));
        if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
      } catch (e) {
        console.error('Failed to load data', e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const login = async (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      await AsyncStorage.setItem('bustrack_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('bustrack_user');
  };

  const addAdmin = async (name, email, password, phone) => {
    if (user?.role !== 'super_admin') throw new Error('Only Super Admin can add admins');
    const newAdmin = { id: Date.now().toString(), name, email, password, phone, role: 'admin', createdAt: new Date() };
    const updatedUsers = [...users, newAdmin];
    setUsers(updatedUsers);
    await AsyncStorage.setItem('bustrack_users', JSON.stringify(updatedUsers));
    return newAdmin;
  };

  const addBus = async (busNumber) => {
    if (!['super_admin','admin'].includes(user?.role)) throw new Error('Only Admins or Super Admin can add buses');
    const newBus = { id: Date.now().toString(), number: busNumber, status: 'active', currentLocation: { lat: 11.2760, lng: 77.5932 }, stops: [] };
    const updatedBuses = [...buses, newBus];
    setBuses(updatedBuses);
    await AsyncStorage.setItem('bustrack_buses', JSON.stringify(updatedBuses));
    return newBus;
  };

  const addDriver = async (name, email, password, phone) => {
    if (!['super_admin','admin'].includes(user?.role)) throw new Error('Only Admins or Super Admin can add drivers');
    const newDriver = { id: Date.now().toString(), name, email, password, phone, role: 'driver', createdAt: new Date() };
    const updatedUsers = [...users, newDriver];
    setUsers(updatedUsers);
    await AsyncStorage.setItem('bustrack_users', JSON.stringify(updatedUsers));
    return newDriver;
  };

  const assignDriverToBus = async (driverId, busId) => {
    if (!['super_admin','admin'].includes(user?.role)) throw new Error('Only Admins or Super Admin can assign drivers');
    const today = new Date().toISOString().split('T')[0];
    const assignment = { id: Date.now().toString(), driverId, busId, date: today };
    const updatedAssignments = [...assignments.filter(a => !(a.driverId === driverId && a.date === today)), assignment];
    setAssignments(updatedAssignments);
    await AsyncStorage.setItem('bustrack_assignments', JSON.stringify(updatedAssignments));
    return assignment;
  };

  const getAssignedBus = (driverId) => {
    const today = new Date().toISOString().split('T')[0];
    const assignment = assignments.find(a => a.driverId === driverId && a.date === today);
    if (!assignment) return null;
    return buses.find(b => b.id === assignment.busId) || null;
  };

  return (
    <AuthContext.Provider value={{
      user, users, buses, assignments,
      login, logout, addAdmin, addBus, addDriver, assignDriverToBus, getAssignedBus, loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
