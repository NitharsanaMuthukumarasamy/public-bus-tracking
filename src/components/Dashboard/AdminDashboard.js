import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  AlertTriangle,
  Users,
  Bus as BusIcon,
  Eye,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
//import { mockBuses, mockAlerts } from "../../data/mockData";
import MapView, { Marker } from "react-native-maps";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [buses, setBuses] = useState(mockBuses);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedBus, setSelectedBus] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const canAddAdmins = user?.role === "super_admin";

  const stats = {
    totalBuses: buses.length,
    activeBuses: buses.filter((b) => b.status === "active").length,
    alerts: alerts.filter((a) => !a.resolved).length,
    drivers: buses.length,
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {user?.role === "super_admin" ? "Super Admin" : "Admin"} Dashboard
          </Text>
          <Text style={styles.subtitle}>
            Manage buses, drivers, and monitor system alerts
          </Text>
        </View>

        {canAddAdmins && (
          <TouchableOpacity style={styles.buttonPrimary}>
            <Plus size={20} color="white" />
            <Text style={styles.btnText}>Add Admin</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {[
          { id: "overview", label: "Overview", icon: BusIcon },
          { id: "buses", label: "Buses", icon: BusIcon },
          { id: "alerts", label: "Alerts", icon: AlertTriangle },
          { id: "map", label: "Live Map", icon: MapPin },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon
              size={18}
              color={activeTab === tab.id ? "#2563EB" : "#6B7280"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && { color: "#2563EB" },
              ]}
            >
              {tab.label}
            </Text>
            {tab.id === "alerts" && stats.alerts > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.alerts}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Overview */}
      {activeTab === "overview" && (
        <View>
          <View style={styles.cardRow}>
            <StatCard
              title="Total Buses"
              value={stats.totalBuses}
              icon={<BusIcon size={24} color="#2563EB" />}
            />
            <StatCard
              title="Active Buses"
              value={stats.activeBuses}
              icon={<MapPin size={24} color="#16A34A" />}
            />
            <StatCard
              title="Active Alerts"
              value={stats.alerts}
              icon={<AlertTriangle size={24} color="#DC2626" />}
            />
            <StatCard
              title="Drivers"
              value={stats.drivers}
              icon={<Users size={24} color="#6B7280" />}
            />
          </View>

          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {alerts.slice(0, 3).map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <AlertTriangle size={20} color="#DC2626" />
              <View>
                <Text style={styles.alertTitle}>Bus {alert.busNumber}</Text>
                <Text style={styles.alertMsg}>{alert.message}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Buses */}
      {activeTab === "buses" && (
        <View>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Bus Management</Text>
            <TouchableOpacity style={styles.buttonPrimary}>
              <Plus size={18} color="white" />
              <Text style={styles.btnText}>Add Bus</Text>
            </TouchableOpacity>
          </View>

          {buses.map((bus) => (
            <View key={bus.id} style={styles.card}>
              <Text style={styles.busTitle}>{bus.number}</Text>
              <Text style={styles.busRoute}>{bus.route}</Text>
              <Text style={styles.busDriver}>Driver: {bus.driver}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={() => setSelectedBus(bus)}
                >
                  <Eye size={16} color="white" />
                  <Text style={styles.btnText}>View Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSecondary}>
                  <Edit2 size={16} color="#111" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonDanger}>
                  <Trash2 size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Alerts */}
      {activeTab === "alerts" && (
        <View>
          <Text style={styles.sectionTitle}>System Alerts</Text>
          {alerts.map((alert) => (
            <View
              key={alert.id}
              style={[styles.card, alert.resolved && { opacity: 0.6 }]}
            >
              <Text style={styles.alertTitle}>Bus {alert.busNumber}</Text>
              <Text style={styles.alertMsg}>{alert.message}</Text>
              {!alert.resolved && (
                <TouchableOpacity
                  style={styles.buttonSuccess}
                  onPress={() => handleResolveAlert(alert.id)}
                >
                  <Text style={styles.btnText}>Resolve</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Map */}
      {activeTab === "map" && (
        <View style={{ height: 400 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 12.9716,
              longitude: 77.5946,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {buses.map((bus) => (
              <Marker
                key={bus.id}
                coordinate={{
                  latitude: bus.location.lat,
                  longitude: bus.location.lng,
                }}
                title={`Bus ${bus.number}`}
                description={bus.route}
              />
            ))}
          </MapView>
        </View>
      )}
    </ScrollView>
  );
}

/* Reusable stat card */
function StatCard({ title, value, icon }) {
  return (
    <View style={styles.card}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#111" },
  subtitle: { color: "#6B7280" },
  buttonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonSecondary: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  buttonDanger: { padding: 8, backgroundColor: "#DC2626", borderRadius: 8 },
  buttonSuccess: {
    padding: 8,
    backgroundColor: "#16A34A",
    borderRadius: 8,
    marginTop: 8,
  },
  btnText: { color: "white", marginLeft: 6 },
  tabRow: { flexDirection: "row", marginBottom: 16 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  tabActive: { backgroundColor: "#fff", borderColor: "#2563EB", borderWidth: 1 },
  tabText: { marginLeft: 6, color: "#6B7280" },
  badge: {
    backgroundColor: "#DC2626",
    borderRadius: 8,
    paddingHorizontal: 6,
    marginLeft: 6,
  },
  badgeText: { color: "white", fontSize: 12 },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  statTitle: { color: "#6B7280" },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#111" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  alertTitle: { fontWeight: "bold", color: "#111" },
  alertMsg: { fontSize: 12, color: "#6B7280" },
  busTitle: { fontWeight: "bold", fontSize: 16 },
  busRoute: { color: "#6B7280" },
  busDriver: { fontSize: 12, color: "#9CA3AF" },
  actionRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
});
