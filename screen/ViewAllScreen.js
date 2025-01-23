import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import ikon
import api from "../src/utils/api";
import { useRoute } from "@react-navigation/native";

const ViewAllScreen = ({ navigation }) => {
  const { params } = useRoute();
  const category = params?.category;
  const [allNews, setAllNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Query pencarian
  const [loading, setLoading] = useState(false); // Loading pencarian
  const [error, setError] = useState(null); // Error handling

  const fetchAllNews = async () => {
    setLoading(true);
    try {
      const category = params?.category;
      const response = await api.get(
        `/news/category?category=${category}&viewAll=y`
      );
      setAllNews(response.data.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Unable to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, [category]);

  const handleSearch = async (query) => {
    // console.log(query, "query query query");
    setSearchQuery(query);

    if (query.trim() === "") {
      // Reset data jika input kosong
      fetchAllNews();
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/news/search?name=${query}`);

      // Validasi data dari response
      const searchResults = response.data?.data || []; // Gunakan default array kosong jika undefined

      if (Array.isArray(searchResults) && searchResults.length > 0) {
        setAllNews(searchResults); // Perbarui daftar berita dengan hasil pencarian
        navigation.navigate("ViewAllScreen", { category: "All" }); // Aktifkan tab All
      } else {
        setAllNews([]); // Kosongkan data jika tidak ada hasil
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleContainer}
      onPress={() => navigation.navigate("ArticleScreen", { slug: item.slug })}
    >
      <Image source={{ uri: item.image_url }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleAuthor}>
          By {item.author_id || "Unknown"}
        </Text>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleTime}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>News</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search articles..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Icon
          name="search"
          size={20}
          color="#999999"
          style={styles.searchIcon}
        />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ViewAllScreen", { category: "All" })
          }
        >
          <Text
            style={[styles.tabItem, category === "All" && styles.activeTab]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ViewAllScreen", { category: "Headline" })
          }
        >
          <Text
            style={[
              styles.tabItem,
              category === "Headline" && styles.activeTab,
            ]}
          >
            Headline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ViewAllScreen", { category: "Berita" })
          }
        >
          <Text
            style={[styles.tabItem, category === "Berita" && styles.activeTab]}
          >
            Berita
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ViewAllScreen", { category: "Acara" })
          }
        >
          <Text
            style={[styles.tabItem, category === "Acara" && styles.activeTab]}
          >
            Acara
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ViewAllScreen", { category: "Advertorial" })
          }
        >
          <Text
            style={[
              styles.tabItem,
              category === "Advertorial" && styles.activeTab,
            ]}
          >
            Advertorial
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF4C4C" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : (
        <FlatList
          data={allNews}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.articleList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FF4C4C",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  icon: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  tabItem: {
    paddingVertical: 10,
    color: "#999999",
    fontSize: 16,
  },
  activeTab: {
    color: "#FF4C4C",
    borderBottomWidth: 2,
    borderBottomColor: "#FF4C4C",
  },
  articleList: {
    padding: 20,
  },
  articleContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  articleAuthor: {
    color: "#999999",
    fontSize: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  articleTime: {
    fontSize: 12,
    color: "#999999",
  },
  loader: {
    marginTop: 20,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F9F9F9",
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  searchIcon: {
    marginLeft: 8,
  },
});

export default ViewAllScreen;
