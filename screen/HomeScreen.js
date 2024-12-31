import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import api from "../src/utils/api";

const HomeScreen = ({ navigation }) => {
  const [breakingNews, setBreakingNews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false); // Untuk toggle input pencarian
  const [searchQuery, setSearchQuery] = useState(""); // Teks pencarian
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);

  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/news");
        setBreakingNews(response.data.data.slice(0, 5)); // Breaking News
        setRecommendations(response.data.data.slice(5)); // Recommendations
        setFilteredRecommendations(response.data.data.slice(5)); // Data rekomendasi yang difilter
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Fungsi untuk mencari berita berdasarkan title
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredRecommendations(recommendations); // Tampilkan semua jika pencarian kosong
    } else {
      const filtered = recommendations.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecommendations(filtered);
    }
  };

  const renderBreakingNews = ({ item }) => (
    <TouchableOpacity
      style={styles.breakingCard}
      onPress={() => navigation.navigate("ArticleScreen", { slug: item.slug })}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.breakingImage}
        resizeMode="cover"
      />
      <View style={styles.breakingOverlay}>
        <Text style={styles.categoryTag}>Sports</Text>
        <Text style={styles.breakingTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // const renderRecommendation = ({ item }) => (
  //   <TouchableOpacity
  //     style={styles.recommendationCard}
  //     onPress={() => navigation.navigate("ArticleScreen", { slug: item.slug })}
  //   >
  //     <Image
  //       source={{ uri: item.image_url }}
  //       style={styles.recommendationImage}
  //     />
  //     <View style={styles.recommendationContent}>
  //       <Text style={styles.categoryTag}>Education</Text>
  //       <Text style={styles.recommendationTitle} numberOfLines={2}>
  //         {item.title}
  //       </Text>
  //       <Text style={styles.recommendationSubtitle}>
  //         {item.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
  //       </Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {isSearching ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Search news..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        ) : (
          <Text style={styles.headerTitle}>Home</Text>
        )}
        <View style={styles.headerIcons}>
          {isSearching ? (
            <TouchableOpacity onPress={() => setIsSearching(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Feather name="search" size={24} color="#333" />
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Breaking News Section */}
      <View style={styles.section}>
        <View style={styles.breakingNewsHeader}>
          <Text style={styles.sectionTitle}>Breaking News</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={breakingNews}
            keyExtractor={(item) => item.id}
            renderItem={renderBreakingNews}
          />
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommendation</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      {/* Content */}
      <FlatList
        data={filteredRecommendations} // Data rekomendasi yang difilter
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Recommendation Header */}
            <View style={styles.section}>
              {/* Scrollable Recommendation Section */}
              <ScrollView
                style={{ height: windowHeight * 0.3 }}
                showsVerticalScrollIndicator={true}
              >
                {filteredRecommendations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recommendationCard}
                    onPress={() =>
                      navigation.navigate("ArticleScreen", { slug: item.slug })
                    }
                  >
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.recommendationImage}
                    />
                    <View style={styles.recommendationContent}>
                      <Text style={styles.categoryTag}>Education</Text>
                      <Text
                        style={styles.recommendationTitle}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.recommendationSubtitle}>
                        {item.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        }
      />
      {/* Category Section */}
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Category</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { id: "1", name: "Wartawan", icon: "person" },
            { id: "2", name: "Narasumber", icon: "mic" },
            { id: "3", name: "Humas", icon: "briefcase" },
            { id: "4", name: "Jasa", icon: "hammer" },
            { id: "5", name: "Umum", icon: "people" },
            { id: "6", name: "Info", icon: "information-circle" },
            // { id: "7", name: "Info", icon: "information-circle" },
            // { id: "8", name: "Info", icon: "information-circle" },
            // { id: "9", name: "Info", icon: "information-circle" },
            // { id: "10", name: "Info", icon: "information-circle" },
          ].map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <TouchableOpacity style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={45} color="#EEEDED" />
              </TouchableOpacity>
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* Featured Promotions Section */}
      <View style={styles.promotionSection}>
        <Text style={styles.sectionTitle}>Cek yang menarik di GoFood</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            {
              id: "1",
              title: "Diskon 30%",
              subtitle: "Toko Buah Semoga Berkah, Bendungan Hilir",
              image: "https://via.placeholder.com/150",
              ad: false,
            },
            {
              id: "2",
              title: "Dipesan 10+ kali",
              subtitle: "",
              image: "https://via.placeholder.com/150",
              ad: true,
            },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.promotionCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.promotionImage}
              />
              <View style={styles.promotionOverlay}>
                <Text style={styles.promotionTitle}>{item.title}</Text>
                <Text style={styles.promotionSubtitle}>{item.subtitle}</Text>
              </View>
              {item.ad && <Text style={styles.adBadge}>Ad</Text>}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  breakingNewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAll: {
    fontSize: 14,
    color: "#FF4C4C",
  },
  breakingCard: {
    width: 300,
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  breakingImage: {
    width: "100%",
    height: 200,
  },
  breakingOverlay: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  categoryTag: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#FF4C4C",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  breakingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  recommendationCard: {
    flexDirection: "row",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  recommendationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  recommendationContent: {
    flex: 1,
    justifyContent: "center",
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  recommendationSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },

  // section categoty
  categorySection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryCard: {
    flex: 1,
    alignItems: "center",
    marginVertical: 10,
  },
  categoryIcon: {
    backgroundColor: "#FF4C4C",
    width: 80,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    margin: 3,
  },
  categoryText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },

  // promotion Section: {

  promotionSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  promotionCard: {
    width: 250,
    height: 150,
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  promotionImage: {
    width: "100%",
    height: "100%",
  },
  promotionOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  promotionSubtitle: {
    fontSize: 12,
    color: "#fff",
  },
  adBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF6F61",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default HomeScreen;
