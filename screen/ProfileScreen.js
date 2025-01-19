import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/utils/api"; // Mengimpor instance API
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = ({ setIsLoggedIn }) => {
  // Pindahkan ke level komponen
  const navigation = useNavigation();
  const [user, setUser] = useState(null); // State untuk menyimpan data pengguna
  const [loading, setLoading] = useState(true); // State untuk indikator loading

  const handleLogout = async () => {
    try {
      // Ambil token dari AsyncStorage
      const token = await AsyncStorage.getItem("access_token");
      console.log("Token for logout:", token);

      if (!token) {
        Alert.alert("Logout Failed", "No token found. Please log in again.");
        setIsLoggedIn(false); // Pastikan status login direset
        return;
      }

      // Panggil API logout
      await api.post(
        "/logout",
        {}, // Body kosong untuk logout
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Hapus token dari AsyncStorage
      await AsyncStorage.removeItem("access_token");
      // console.log("Token removed from AsyncStorage");
      setIsLoggedIn(false);
      // Reset navigasi ke layar Login
    } catch (error) {
      console.error("Error logging out:", error);

      // Tampilkan pesan error
      Alert.alert(
        "Logout Failed",
        "There was an error logging out. Please try again later."
      );
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          Alert.alert("Error", "No access token found. Please log in again.");
          setIsLoggedIn(false);
          return;
        }

        const response = await api.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load user data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://source.unsplash.com/random/100x100" }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.position}>{user.media}</Text>
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
      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.sectionContent}>Email: {user.email}</Text>
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
