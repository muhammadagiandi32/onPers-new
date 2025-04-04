import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/utils/api";

const CategoryMessagesScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchUsers = async ({ category = "", keyword = "" } = {}) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await api.get("/get-users", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          category,
          keyword,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // panggil saat pertama kali component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <LinearGradient colors={["#FF4C4C", "#e33810"]} style={styles.topSection}>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon
            name="search-outline"
            size={20}
            color="#aaa"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search By Media, Lokasi"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            value={searchKeyword}
            onChangeText={(text) => setSearchKeyword(text)}
            onSubmitEditing={() =>
              fetchUsers({ category: selectedCategory, keyword: searchKeyword })
            }
          />
          {searchKeyword.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchKeyword("");
                fetchUsers({ category: selectedCategory, keyword: "" });
              }}
            >
              <Icon name="close-circle" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { id: "1", name: "Wartawan", icon: "pencil" },
              { id: "2", name: "Narasumber", icon: "mic-outline" },
              { id: "3", name: "Humas", icon: "laptop-outline" },
              { id: "4", name: "Jasa", icon: "briefcase-outline" },
              { id: "5", name: "Umum", icon: "people-outline" },
              { id: "6", name: "Semua", icon: "list" },
            ].map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <TouchableOpacity
                  style={styles.categoryIcon}
                  onPress={() => {
                    const isAll = category.name === "Semua";
                    const selected = isAll ? "" : category.name;

                    setSelectedCategory(selected);
                    fetchUsers({
                      category: selected,
                      keyword: searchKeyword,
                    });
                  }}
                >
                  <Icon name={category.icon} size={40} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.contentWrapper}>
          <Text style={styles.sectionTitle}>Chat Langsung Wartawan</Text>
          <FlatList
            data={users.data}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ChatScreen", {
                    name: item.name,
                    email: item.email,
                  })
                }
                style={styles.card}
              >
                <Image
                  source={{
                    uri:
                      item.image ||
                      "https://randomuser.me/api/portraits/lego/7.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.subText}>
                    <Icon name="location-outline" size={12} color="#888" />
                    {item.location || "Jakarta"}
                  </Text>
                  <Text style={styles.subText}>
                    <Text style={styles.label}>Instansi: </Text>
                    {item.media || "-"}
                  </Text>
                  <Text style={styles.subText}>
                    <Text style={styles.label}>Category: </Text>
                    {item.role}
                  </Text>
                </View>
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Icon name="star" size={16} color="#facc15" />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default CategoryMessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEDED",
  },
  topSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
  },
  categoryItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    alignItems: "center",
    width: 100,
  },
  categoryActive: {
    backgroundColor: "#2E6EF7",
  },
  categoryText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    color: "#ffffff",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#EEEDED",
  },
  contentWrapper: {
    marginTop: -30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  label: {
    color: "#888",
  },
  ratingBox: {
    alignItems: "center",
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 16,
  },
  categoryIcon: {
    // backgroundColor: "#2e6ef7",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
    marginBottom: 50,
  },
});
