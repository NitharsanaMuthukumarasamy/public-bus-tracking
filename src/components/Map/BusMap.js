// BusMap.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapPin, Navigation, Clock } from "lucide-react-native";

export default function BusMap({ buses = [], selectedBus, height = 400 }) {
  const [mapRegion, setMapRegion] = useState({
    latitude: 11.276,
    longitude: 77.5932,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    if (selectedBus) {
      setMapRegion({
        latitude: selectedBus.currentLocation.lat,
        longitude: selectedBus.currentLocation.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else if (buses.length > 0) {
      const avgLat =
        buses.reduce((sum, bus) => sum + bus.currentLocation.lat, 0) /
        buses.length;
      const avgLng =
        buses.reduce((sum, bus) => sum + bus.currentLocation.lng, 0) /
        buses.length;
      setMapRegion({
        latitude: avgLat,
        longitude: avgLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [selectedBus, buses]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "traffic":
        return "orange";
      case "breakdown":
      case "accident":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Navigation size={18} color="#2563EB" />
          <Text style={styles.headerText}>Live Bus Tracking</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Google Map */}
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
      >
        {/* Bus Markers */}
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={{
              latitude: bus.currentLocation.lat,
              longitude: bus.currentLocation.lng,
            }}
            title={`Bus ${bus.number}`}
            description={`Driver: ${bus.driver} | Status: ${bus.status}`}
            pinColor={getStatusColor(bus.status)}
          />
        ))}

        {/* Stops for selected bus */}
        {selectedBus?.stops?.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.lat,
              longitude: stop.lng,
            }}
            title={stop.name}
            description={`ETA: ${stop.estimatedArrival}`}
            pinColor="blue"
          />
        ))}
      </MapView>

      {/* Extra Info UI */}
      <ScrollView contentContainerStyle={styles.content}>
        {selectedBus?.stops && (
          <View style={styles.stopsGrid}>
            {selectedBus.stops.map((stop) => (
              <View key={stop.id} style={styles.stopCard}>
                <View style={styles.stopHeader}>
                  <MapPin size={14} color="#2563EB" />
                  <Text style={styles.stopName}>{stop.name}</Text>
                </View>
                <View style={styles.stopTime}>
                  <Clock size={12} color="#6B7280" />
                  <Text style={styles.stopEta}>{stop.estimatedArrival}</Text>
                </View>
                <Text style={styles.stopDistance}>
                  {stop.distance?.toFixed(1)} km away
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Status</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#22C55E" }]} />
          <Text style={styles.legendText}>Active</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#EAB308" }]} />
          <Text style={styles.legendText}>Traffic</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
          <Text style={styles.legendText}>Issues</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#93C5FD",
    overflow: "hidden",
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 14, fontWeight: "600", color: "#374151", marginLeft: 6 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" },
  liveText: { fontSize: 12, color: "#374151", marginLeft: 4 },

  map: { flex: 1, marginTop: 40 },

  content: { padding: 16 },
  stopsGrid: { marginTop: 8 },
  stopCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  stopHeader: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  stopName: { fontSize: 14, fontWeight: "600", color: "#111827", marginLeft: 4 },
  stopTime: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  stopEta: { fontSize: 12, color: "#6B7280", marginLeft: 4 },
  stopDistance: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },

  legend: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    color: "#374151",
  },
  legendItem: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: "#6B7280", marginLeft: 4 },
});
