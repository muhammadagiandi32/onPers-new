import React, { useState, useEffect, useRef } from "react";
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
  LogBox,
  Modal,
} from "react-native";
import { Video } from "expo-av";
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

import { Ionicons, Feather } from "@expo/vector-icons";
import api from "../src/utils/api";
// import Constants from "expo-constants";
// console.log("Android versionCode:", Constants.expoConfig?.android?.versionCode);
// console.log("📦 App Info", {
//   name: Constants.expoConfig?.name,
//   version: Constants.expoConfig?.version,
//   versionCode: Constants.expoConfig?.android?.versionCode,
// });

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false); // Untuk toggle input pencarian
  const [searchQuery, setSearchQuery] = useState(""); // Teks pencarian
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);

  // News By category and BreakingNews
  const [BeritaHeadline, setBeritaHeadline] = useState([]);
  const [BeritaBerita, setBeritBerita] = useState([]);
  const [BeritAcara, setBeritAcara] = useState([]);
  const [BeritaAdvertorial, setBeritaAdvertorial] = useState([]);
  const [BreakingNews, setBereakingNews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectFotoName, setSelectFotoName] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const advertorialNews = await api.get("/news/category", {
          params: { category: "Berita" },
        });
        setBeritaHeadline(advertorialNews.data.data);

        const beritaNews = await api.get("/news/category", {
          params: { category: "Headline" },
        });
        setBeritBerita(beritaNews.data.data);

        const acaraNews = await api.get("/news/category", {
          params: { category: "Acara" },
        });
        setBeritAcara(acaraNews.data.data);

        const BeritaAdvertorial = await api.get("/news/category", {
          params: { category: "Advertorial" },
        });
        setBeritaAdvertorial(BeritaAdvertorial.data.data);

        const breakingNews = await api.get("/breaking-news");
        setBereakingNews(breakingNews.data.data);

        const response = await api.get("/news");
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
      setFilteredRecommendations(filteredRecommendations); // Tampilkan semua jika pencarian kosong
    } else {
      const filtered = filteredRecommendations.filter((item) =>
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
        <Text style={styles.categoryTag}>{item.category_name}</Text>
        <Text style={styles.breakingTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // Video
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const VideoCard = ({ videoUri }) => {
    const [isMuted, setIsMuted] = useState(true); // Default mute
    return (
      <View style={styles.videoContainer}>
        {/* Video */}
        <Video
          source={{ uri: videoUri }}
          style={[styles.video, { width: SCREEN_WIDTH - 0 }]} // Lebar dinamis
          resizeMode="cover"
          shouldPlay={true} // Video langsung diputar
          isLooping={true} // Video diputar terus-menerus
          isMuted={isMuted} // Mengontrol status mute
          useNativeControls={false} // Nonaktifkan kontrol bawaan
        />

        {/* Ikon Mute/Unmute */}
        <TouchableOpacity
          style={styles.muteIconContainer}
          onPress={() => setIsMuted((prev) => !prev)} // Toggle mute/unmute
        >
          <Image
            source={
              isMuted
                ? require("../assets/mute.png") // Ganti dengan path ikon mute
                : require("../assets/unmute.png") // Ganti dengan path ikon unmute
            }
            style={styles.muteIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const VideoSection = () => {
    // Data dummy untuk video
    const videos = [
      "https://is3.cloudhost.id/onpers-storage/onpers-storage/9a0fd3cd-5277-4162-a86c-52b925aae3ea.mp4",
      "https://onpers-storage.is3.cloudhost.id/onpers-storage/f43f50cb-6cdd-4ea7-8025-74acf1a01c62.mp4",
    ];

    return (
      <View style={styles.container}>
        <ScrollView
          horizontal // Scroll secara horizontal
          showsHorizontalScrollIndicator={false} // Sembunyikan scrollbar
          contentContainerStyle={styles.scrollContainer}
        >
          {videos.map((videoUri, index) => (
            <View key={index}>
              <VideoCard videoUri={videoUri} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const PromotionSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null); // Ref untuk mengontrol FlatList

    const data = [
      {
        id: "1",
        title: "",
        subtitle: "",
        image:
          "https://is3.cloudhost.id/onpers-storage/onpers-storage/iklan-apk-1.png",
        ad: true,
      },
      {
        id: "2",
        title: "",
        subtitle: "",
        image:
          "https://is3.cloudhost.id/onpers-storage/onpers-storage/iklan-apk-2.png",
        ad: false,
      },
    ];

    // Pergeseran otomatis setiap 3 detik
    useEffect(() => {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % data.length; // Loop kembali ke awal jika di akhir
        setCurrentIndex(nextIndex);

        // Pindahkan FlatList ke slide berikutnya
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 3000); // 3 detik

      return () => clearInterval(interval); // Bersihkan interval saat komponen di-unmount
    }, [currentIndex]);

    const handleScroll = (event) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setCurrentIndex(newIndex);
    };

    return (
      <View style={styles.promotionSection}>
        {/* <Text style={styles.sectionTitle}>Advertorial</Text> */}
        <FlatList
          ref={flatListRef} // Ref untuk mengontrol FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.promotionCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.promotionImage}
              />
              {/* <View style={styles.promotionOverlay}>
                <Text style={styles.promotionTitle}>{item.title}</Text>
                <Text style={styles.promotionSubtitle}>{item.subtitle}</Text>
              </View> */}
              {item.ad && <Text style={styles.adBadge}>Ad</Text>}
            </View>
          )}
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        {/* Indikator titik */}
        <View style={styles.indicatorContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index ? styles.activeIndicator : null,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            // <Text style={styles.headerTitle}>Home</Text>
            <Image
              source={require("../assets/logo-onpers.png")}
              style={styles.headerLogo}
            />
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
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={BreakingNews}
              keyExtractor={(item) => item.id}
              renderItem={renderBreakingNews}
              nestedScrollEnabled={true}
            />
          )}
        </View>
        {/* Category Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            {/* <Text style={styles.sectionTitle}>Category</Text> */}
            {/* <TouchableOpacity>
              <Text style={styles.viewAll}>See All</Text>
            </TouchableOpacity> */}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { id: "1", name: "Wartawan", icon: "pencil" },
              { id: "2", name: "Narasumber", icon: "mic-outline" },
              { id: "3", name: "Humas", icon: "laptop-outline" },
              { id: "4", name: "Jasa", icon: "briefcase-outline" },
              { id: "5", name: "Umum", icon: "people-outline" },
              { id: "6", name: "Info", icon: "information-outline" },
            ].map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <TouchableOpacity
                  style={styles.categoryIcon}
                  onPress={() =>
                    category.name === "Info"
                      ? navigation.navigate("RedaksiScreen")
                      : navigation.navigate("CategoryMessagesScreen", {
                          category,
                        })
                  }
                >
                  <Ionicons name={category.icon} size={45} color="#EEEDED" />
                </TouchableOpacity>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Video Section */}
        <VideoSection />
        {/* Headline Section */}
        <View style={styles.section}>
          <View style={styles.breakingNewsHeader}>
            <Text style={styles.sectionTitle}>Headline</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ViewAllScreen", { category: "Headline" })
              }
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={BeritaBerita} // Data rekomendasi
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
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
                  <Text style={styles.categoryTag}>{item.name}</Text>
                  <Text style={styles.recommendationTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.recommendationSubtitle}>
                    {item.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 300 }}
            nestedScrollEnabled={true}
          />
        </View>
        {/* Berita Section */}
        <View style={styles.section}>
          <View style={styles.breakingNewsHeader}>
            <Text style={styles.sectionTitle}>Berita</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ViewAllScreen", { category: "Berita" })
              }
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={BeritaHeadline} // Data rekomendasi
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
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
                  <Text style={styles.categoryTag}>{item.name}</Text>
                  <Text style={styles.recommendationTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.recommendationSubtitle}>
                    {item.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 300 }} // Batasi tinggi FlatList agar tidak memenuhi layar
            nestedScrollEnabled={true} // Aktifkan pengguliran bersarang
          />
        </View>

        {/* Acara Section */}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto Acara</Text>

            <FlatList
              data={BeritAcara}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    setSelectedImage(item.image_url);
                    setModalVisible(true);
                    setSelectFotoName(item.title);
                  }}
                >
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardOverlay}>
                    <Text style={styles.cardCategory}>Foto News</Text>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {/* MODAL untuk gambar */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          >
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <Text style={styles.cardTitle} numberOfLines={2}>
              {selectFotoName}
            </Text>
          </TouchableOpacity>
        </Modal>

        {/* Advertorial Section */}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View style={styles.section}>
            <View style={styles.breakingNewsHeader}>
              <Text style={styles.sectionTitle}>Advertorial</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ViewAllScreen", {
                    category: "Advertorial",
                  })
                }
              >
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={BeritaAdvertorial} // Data rekomendasi
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
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
                    <Text style={styles.categoryTag}>{item.name}</Text>
                    <Text style={styles.recommendationTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.recommendationSubtitle}>
                      {item.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }} // Batasi tinggi FlatList agar tidak memenuhi layar
              nestedScrollEnabled={true} // Aktifkan pengguliran bersarang
            />
          </View>
        )}
        {/* Featured Promotions Section */}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <PromotionSection />
        )}
      </ScrollView>
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
    width: 380,
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
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  promotionCard: {
    width,
    alignItems: "center",
  },
  promotionImage: {
    width: width * 1,
    height: 400,
    borderRadius: 10,
    resizeMode: "cover",
  },
  promotionOverlay: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    bottom: 0,
    width: "100%",
    // backgroundColor: "f034",
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  promotionSubtitle: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
  },
  adBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#007AFF",
  },
  headerLogo: {
    width: 80, // Lebar logo
    height: 30, // Tinggi logo
    resizeMode: "contain", // Sesuaikan ukuran tanpa distorsi
  },
  video: {
    height: 200, // Tinggi video
    backgroundColor: "#000", // Latar belakang hitam untuk loading video
  },
  muteIconContainer: {
    position: "absolute",
    bottom: 10, // Jarak dari bawah video
    right: 10, // Jarak dari kanan video
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Latar belakang hitam transparan
    borderRadius: 20,
    padding: 5,
  },
  muteIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff", // Warna ikon (jika menggunakan gambar yang mendukung tintColor)
  },
  videoCard: {
    width: 300,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#000", // atau apapun
  },

  // Foto News
  card: {
    width: 200,
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cardCategory: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 4,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 16,
  },
});

export default HomeScreen;
