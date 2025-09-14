import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Bus, Mail, Lock, LogIn } from 'lucide-react-native'; // ✅ use RN version
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'superadmin@bustrack.com', role: 'Super Admin', color: '#9333EA' },
    { email: 'admin@bustrack.com', role: 'Admin', color: '#2563EB' },
    { email: 'driver@bustrack.com', role: 'Driver', color: '#16A34A' },
    { email: 'user@bustrack.com', role: 'User', color: '#4B5563' },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoBox}>
        <View style={styles.iconWrapper}>
          <Bus size={32} color="white" />
        </View>
        <Text style={styles.title}>BusTracker</Text>
        <Text style={styles.subtitle}>Real-time Bus Tracking System</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Mail size={20} color="#9CA3AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Lock size={20} color="#9CA3AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.btnContent}>
              <LogIn size={20} color="white" />
              <Text style={styles.btnText}>Sign In</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>Demo Accounts:</Text>
        {demoAccounts.map((account) => (
          <TouchableOpacity
            key={account.email}
            style={styles.demoCard}
            onPress={() => {
              setEmail(account.email);
              setPassword('password');
            }}
          >
            <View>
              <Text style={styles.demoEmail}>{account.email}</Text>
              <Text style={[styles.demoRole, { color: account.color }]}>
                {account.role}
              </Text>
            </View>
            <Text style={styles.clickText}>Click to use</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.passwordNote}>
          Password for all demo accounts: <Text style={{ fontWeight: 'bold' }}>password</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
  },
  error: {
    color: '#DC2626',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '600',
  },
  demoSection: {
    width: '100%',
  },
  demoTitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  demoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  demoEmail: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  demoRole: {
    fontSize: 12,
  },
  clickText: {
    fontSize: 12,
    color: '#6B7280',
  },
  passwordNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});
