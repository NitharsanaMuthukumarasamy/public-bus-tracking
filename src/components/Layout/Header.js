// Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, LogOut, Bus } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'driver':
        return 'Driver';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return styles.rolePurple;
      case 'admin':
        return styles.roleBlue;
      case 'driver':
        return styles.roleGreen;
      case 'user':
        return styles.roleGray;
      default:
        return styles.roleGray;
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <View style={styles.logoBox}>
          <Bus size={24} color="white" />
        </View>
        <View>
          <Text style={styles.title}>BusTracker</Text>
          <Text style={styles.subtitle}>Real-time Bus Tracking System</Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.userInfo}>
          <View style={styles.userIconBox}>
            <User size={20} color="#4B5563" />
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{user?.name}</Text>
            <View style={styles.roleContainer}>
              <View style={[styles.badge, getRoleColor(user?.role)]}>
                <Text style={styles.badgeText}>{getRoleDisplay(user?.role || '')}</Text>
              </View>
              {user?.busNumber && (
                <View style={[styles.badge, styles.badgeInfo]}>
                  <Text style={styles.badgeText}>Bus: {user.busNumber}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <LogOut size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    backgroundColor: '#2563EB',
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  userIconBox: {
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  userTextContainer: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  roleContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
  },
  badgeInfo: {
    backgroundColor: '#DBEAFE',
  },
  rolePurple: { backgroundColor: '#EDE9FE' },
  roleBlue: { backgroundColor: '#DBEAFE' },
  roleGreen: { backgroundColor: '#D1FAE5' },
  roleGray: { backgroundColor: '#F3F4F6' },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
  },
});
