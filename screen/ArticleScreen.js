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

const ArticleScreen = ({ route, navigation }) => {
  const { slug } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- helpers ---
  const sanitizeHtml = (html) =>
    html ? html.replace(/style="[^"]*"/g, "") : "";
  const truncateHTML = (html, wordLimit = 25) => {
    if (!html) return "";
    const textOnly = html.replace(/<[^>]+>/g, "");
    const words = textOnly.trim().split(/\s+/);
    if (words.length <= wordLimit) return textOnly;
    return words.slice(0, wordLimit).join(" ");
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const d = new Date(dateString);
    if (isNaN(d)) return "";
    const dayName = days[d.getDay()];
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${dayName}, ${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/news-details/${slug}`);
        setArticle(data?.data ?? null);
        console.log(data?.data);
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const onShare = async () => {
    if (!article) return;
    try {
      const result = await Share.share({
        message: `Baca berita ini: ${truncateHTML(article.content)}`,
        url: `https://onpers.co.id/news-details/${article.slug}`,
        title: article.title,
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
      console.error("Error saat berbagi:", error?.message);
    }
  };

  if (loading || !article) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // nilai aman untuk UI
  const headerImage =
    article?.image_url ?? "https://via.placeholder.com/800x300";
  const categoryName = article?.category?.name ?? "General"; // category mungkin tidak ada
  const authorName = article?.author?.name ?? article?.author_name ?? "Unknown";
  const createdOrPublished =
    article?.published_at ?? article?.created_at ?? null;

  const ParentComponent = () => (
    <View style={styles.overlay}>
      <Text style={styles.category}>{categoryName}</Text>
      <Text style={styles.title}>{article?.title ?? ""}</Text>
      {createdOrPublished ? (
        <Text style={styles.subtitle}>{formatDate(createdOrPublished)}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={{ uri: headerImage }} style={styles.headerImage}>
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
                uri: article?.source_logo || "https://via.placeholder.com/50",
              }}
              style={styles.sourceImage}
            />
            <Text style={styles.sourceText}>{authorName}</Text>
          </View>

          {/* Render Konten Artikel dengan HTML */}
          <RenderHTML
            contentWidth={Dimensions.get("window").width}
            source={{
              html: sanitizeHtml(
                article?.content ?? "<p>No content available</p>"
              ),
            }}
            baseStyle={styles.articleText}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerImage: { width: "100%", height: 300, justifyContent: "flex-end" },
  headerIcons: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightIcons: { flexDirection: "row" },
  icon: { marginLeft: 20 },
  overlay: { padding: 20, backgroundColor: "rgba(0, 0, 0, 0.4)" },
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
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "#fff", fontSize: 14 },
  content: { padding: 20 },
  source: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  sourceImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  sourceText: { fontSize: 16, fontWeight: "bold" },
  articleText: { fontSize: 16, color: "#333", lineHeight: 24 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#f00" },
});

export default ArticleScreen;
