import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  LogBox,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import api from "../src/utils/api";

// Ignore specific warnings
LogBox.ignoreLogs(["Support for defaultProps will be removed"]);

const FotoScreen = ({ route, navigation }) => {
  const { slug } = route.params; // Terima parameter slug
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/news-details/${slug}`);
        // console.log(response.data.data);
        setArticle(response.data.data); // Simpan data artikel
        setLoading(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}> Article not found. </Text>
      </View>
    );
  }
  const ParentComponent = () => {
    return (
      <View style={styles.overlay}>
        <Text style={styles.category}>
          {article.category.name || "General"}
        </Text>
        <Text style={styles.title}>{article.title}</Text>
        <FormattedDate createdAt={article.created_at} />
      </View>
    );
  };
  const FormattedDate = ({ createdAt }) => {
    const formatDate = (dateString) => {
      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const date = new Date(dateString);

      const dayName = days[date.getDay()]; // Mendapatkan nama hari
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based index
      const day = String(date.getDate()).padStart(2, "0");

      return `${dayName}, ${day}-${month}-${year}`; // Format Hari, dd-mm-yyyy
    };

    return <Text style={styles.subtitle}>{formatDate(createdAt)}</Text>;
  };
  // Sanitize HTML to remove unnecessary attributes or invalid structures
  const sanitizeHtml = (html) => {
    return html.replace(/style="[^"]*"/g, ""); // Hapus atribut style
  };
  const truncateHTML = (html, wordLimit = 25) => {
    // Hapus semua tag HTML sementara untuk menghitung jumlah kata
    const textOnly = html.replace(/<[^>]+>/g, "");
    const words = textOnly.split(/\s+/); // Pisahkan berdasarkan spasi

    // Jika jumlah kata lebih kecil dari limit, kembalikan apa adanya
    if (words.length <= wordLimit) return html;

    // Ambil hanya 25 kata pertama dan tambahkan "..."
    const truncatedText = words.slice(0, wordLimit).join(" ");

    return truncatedText; // Bungkus ulang dalam paragraf
  };
  const onShare = async () => {
    if (!article) {
      console.error("Artikel tidak tersedia untuk dibagikan.");
      return;
    }
    // console.log(truncateHTML(article.content));
    // return;
    try {
      const result = await Share.share({
        message: `Baca berita ini: ${truncateHTML(article.content)}`,
        url: `https://onpers.co.id/news-details/${article.slug}`,
        title: article.title, // Pastikan ada properti `title`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Dibagikan melalui ${result.activityType}`);
        } else {
          console.log("Berhasil dibagikan");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Berbagi dibatalkan");
      }
    } catch (error) {
      console.error("Error saat berbagi:", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: article.image_url }}
        style={styles.headerImage}
      >
        {/* Ikon Header */}
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.icon} onPress={onShare}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Kategori dan Judul */}
        <ParentComponent />
      </ImageBackground>

      <ScrollView style={styles.container}>
        {/* Informasi Berita */}
        <View style={styles.content}>
          <View style={styles.source}>
            <Image
              source={{
                uri: article.source_logo || "https://via.placeholder.com/50",
              }}
              style={styles.sourceImage}
            />
            <Text style={styles.sourceText}>{article.source || "Unknown"}</Text>
          </View>
          {/* Render Konten Artikel dengan HTML */}
          {/* <RenderHTML
            contentWidth={Dimensions.get("window").width}
            source={{
              html: sanitizeHtml(
                article.content || "<p>No content available</p>"
              ),
            }}
            baseStyle={styles.articleText}
          /> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    width: "100%",
    height: 300,
    justifyContent: "flex-end",
  },
  headerIcons: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 20,
  },
  overlay: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  category: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#FF4C4C",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#fff",
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  source: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sourceImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  sourceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  articleText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#f00",
  },
});

export default FotoScreen;
