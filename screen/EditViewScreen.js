import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../src/utils/api"; // Pastikan path ke API benar
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditViewScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]); // State untuk menyimpan data artikel
  const [loading, setLoading] = useState(true); // State untuk loading

  const handleBackPress = () => {
    navigation.goBack(); // Kembali ke halaman sebelumnya
  };
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");

        const response = await api.post(
          "/list-by-author",
          {}, // Body permintaan (kirimkan objek kosong jika tidak ada data yang dikirim)
          {
            headers: {
              Authorization: `Bearer ${token}`, // Header Authorization
            },
          }
        );

        setArticles(response.data.data); // Asumsi data berbentuk array
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false); // Hentikan loading
      }
    };

    fetchArticles();
  }, []); // Dipanggil hanya sekali saat komponen dirender

  const renderArticle = ({ item }) => (
    <View style={styles.activityContainer}>
      <View style={styles.activityLeft}>
        <Image
          source={{ uri: item.image_url }} // Menggunakan URL dari API
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          {/* Membatasi title agar tidak melampaui card */}
          <Text style={styles.activityTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.activityDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("EditArticleScreen", { slug: item.slug })
        }
      >
        <Text style={styles.addButtonText}> EDIT </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}> Edit Article </Text>
          {/* <View style={styles.timeContainer}>
            <Text style={styles.timeText}> 45 mins </Text>
          </View> */}
        </View>
        {/* Subheading */}
        <Text style={styles.subheading}> List Article </Text>
        {/* List of Articles */}
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Penting untuk membuat SafeAreaView fleksibel
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1, // Penting untuk memastikan konten di dalam SafeAreaView fleksibel
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#FF4C4C",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  timeContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF4C4C",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginLeft: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: "contain",
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  activityDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  //   ini style untuk container
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
  },

  activityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden", // Untuk memastikan elemen tidak melewati batas card
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Agar teks dan tombol tidak bertabrakan
  },
  textContainer: {
    flex: 1, // Membuat teks fleksibel
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2, // Tambahkan margin agar lebih rapi
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start", // Agar tombol tetap sejajar ke atas
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default EditViewScreen;
