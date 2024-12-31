import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/utils/api"; // Mengimpor instance API
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation(); // Pindahkan ke level komponen

  const handleLogout = async () => {
    try {
      // Ambil token dari AsyncStorage
      const token = await AsyncStorage.getItem("access_token");
      console.log("Token for logout:", token);

      if (!token) {
        Alert.alert("Logout Failed", "No token found. Please log in again.");
        // return;
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }], // Pastikan nama sesuai dengan Stack.Navigator
        });
      }

      // Panggil API logout
      // await api.post(
      //   "/logout",
      //   {}, // Body kosong untuk logout
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // Hapus token dari AsyncStorage
      await AsyncStorage.removeItem("access_token");
      // console.log("Token removed from AsyncStorage");

      // Reset navigasi ke layar Login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Pastikan nama sesuai dengan Stack.Navigator
      });
    } catch (error) {
      console.error("Error logging out:", error);

      // Tampilkan pesan error
      Alert.alert(
        "Logout Failed",
        "There was an error logging out. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://source.unsplash.com/random/100x100" }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.position}>Software Engineer</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsItem}>
          <Text style={styles.statsValue}>120</Text>
          <Text style={styles.statsLabel}>Posts</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsValue}>5.6K</Text>
          <Text style={styles.statsLabel}>Followers</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsValue}>3.2K</Text>
          <Text style={styles.statsLabel}>Following</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.editButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.sectionContent}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.sectionContent}>Email: john.doe@example.com</Text>
      <Text style={styles.sectionContent}>Phone: +1 123 456 7890</Text>
      <Text style={styles.sectionContent}>
        Address: 123 Main St, Anytown USA
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  position: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  statsLabel: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF5252",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  sectionContent: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
});

export default ProfileScreen;
