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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import api from "../src/utils/api";

// Ignore specific warnings
LogBox.ignoreLogs(["Support for defaultProps will be removed"]);

const ArticleScreen = ({ route, navigation }) => {
  const { slug } = route.params; // Terima parameter slug
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/news-details/${slug}`);
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
        <Text style={styles.errorText}>Article not found.</Text>
      </View>
    );
  }

  // Sanitize HTML to remove unnecessary attributes or invalid structures
  const sanitizeHtml = (html) => {
    return html.replace(/style="[^"]*"/g, ""); // Hapus atribut style
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header dengan Gambar Latar Belakang */}
      <ImageBackground
        source={{
          uri: article.image_url, // Gambar dari API
        }}
        style={styles.headerImage}
      >
        {/* Ikon Header */}
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.icon}>
              <Ionicons name="bookmark-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Kategori dan Judul */}
        <View style={styles.overlay}>
          <Text style={styles.category}> {article.category || "General"} </Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>Trending • {article.date}</Text>
        </View>
      </ImageBackground>
      {/* Informasi Berita */}
      <View style={styles.content}>
        <View style={styles.source}>
          <Image
            source={{
              uri: article.source_logo || "https://via.placeholder.com/50", // Logo sumber berita
            }}
            style={styles.sourceImage}
          />
          <Text style={styles.sourceText}>{article.source || "Unknown"}</Text>
        </View>
        {/* Render Konten Artikel dengan HTML */}
        <RenderHTML
          contentWidth={Dimensions.get("window").width}
          source={{
            html: sanitizeHtml(
              article.content || "<p>No content available</p>"
            ),
          }}
          baseStyle={styles.articleText}
        />
      </View>
    </ScrollView>
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
    backgroundColor: "#007AFF",
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

export default ArticleScreen;
