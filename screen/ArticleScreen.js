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

// Abaikan warning tertentu
LogBox.ignoreLogs(["Support for defaultProps will be removed"]);

const ArticleScreen = ({ route, navigation }) => {
  const { slug } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- Helpers ----------
  const sanitizeHtml = (html) =>
    html ? html.replace(/style="[^"]*"/g, "") : "";

  const truncateHTML = (html, wordLimit = 25) => {
    if (!html) return "";
    const textOnly = html.replace(/<[^>]+>/g, "");
    const words = textOnly.trim().split(/\s+/);
    if (words.length <= wordLimit) return textOnly;
    return words.slice(0, wordLimit).join(" ");
  };

  // Parse ISO (tahan mikrodetik) -> Date UTC
  const parseISOAsUTC = (iso) => {
    if (!iso) return null;
    let s = String(iso).trim();
    // buang mikrodetik kalau ada: 2025-09-06T10:23:05.135232Z -> 2025-09-06T10:23:05Z
    s = s.replace(/\.\d+(Z|[+\-]\d\d:\d\d)$/i, "$1");
    const d = new Date(s);
    return isNaN(d) ? null : d; // ini merepresentasikan waktu UTC yg benar
  };

  // Format ke WIB TANPA mengikuti timezone device
  // Aturan:
  // - Jika string ada offsetnya (Z / +hh:mm / -hh:mm), kita konversi dari UTC ke WIB (+7)
  // - Jika TANPA offset (naive), kita anggap itu sudah WIB (pakai angka apa adanya)
  const formatDateTimeFromDB = (iso) => {
    if (!iso) return "-";
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const hasOffset = /(?:Z|[+\-]\d\d:\d\d)$/i.test(iso);

    if (hasOffset) {
      const dUTC = parseISOAsUTC(iso);
      if (!dUTC) return "-";
      // ms UTC -> tambah 7 jam -> Date “WIB” tetapi kita baca dg getUTC* agar tak terpengaruh device
      const msWIB = dUTC.getTime() + 7 * 60 * 60 * 1000;
      const dWIB = new Date(msWIB);
      const pad = (n) => String(n).padStart(2, "0");
      const dayName = days[dWIB.getUTCDay()];
      const Y = dWIB.getUTCFullYear();
      const M = pad(dWIB.getUTCMonth() + 1);
      const D = pad(dWIB.getUTCDate());
      const h = pad(dWIB.getUTCHours());
      const m = pad(dWIB.getUTCMinutes());
      return `${dayName}, ${D}-${M}-${Y} ${h}:${m} WIB`;
    } else {
      // Anggap iso sudah WIB (tidak ada offset). Ambil angka mentah.
      const m = iso.match(
        /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/
      );
      if (!m) return iso;
      const [, y, mo, d, h, mi, se = "00"] = m;
      // Hitung day name pakai UTC agar device-agnostic (anggap WIB sebagai zona “dasar”)
      const dt = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +se));
      const dayName = days[dt.getUTCDay()];
      return `${dayName}, ${d}-${mo}-${y} ${h}:${mi} WIB`;
    }
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
        message: `Baca berita ini: ${truncateHTML(article?.content)}`,
        url: `https://onpers.co.id/news-details/${article?.slug}`,
        title: article?.title || "Berita",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType)
          console.log(`Dibagikan via ${result.activityType}`);
        else console.log("Berhasil dibagikan");
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

  // ---------- Nilai aman untuk UI ----------
  const headerImage =
    article?.image_url ?? "https://via.placeholder.com/800x300";
  const categoryName = article?.category?.name ?? "General"; // category bisa null di payload
  const authorName = article?.author?.name ?? article?.author_name ?? "Unknown";

  // Ambil dari DB: published_at PRIORITAS, fallback created_at
  const publishedAt = article?.published_at ?? null;
  const createdAt = article?.created_at ?? null;
  const updatedAt = article?.updated_at ?? null;

  const displayedPublished = publishedAt ?? createdAt;

  // cek beda waktu (bandingkan di UTC agar konsisten)
  const isDifferent = (() => {
    const a = parseISOAsUTC(updatedAt)?.getTime();
    const b = parseISOAsUTC(displayedPublished)?.getTime();
    return a && b ? a !== b : false;
  })();

  const ParentComponent = () => (
    <View style={styles.overlay}>
      <Text style={styles.category}>{categoryName}</Text>
      <Text style={styles.title}>{article?.title ?? ""}</Text>
      {displayedPublished ? (
        <Text style={styles.subtitle}>
          {formatDateTimeFromDB(updatedAt ?? createdAt)}
        </Text>
      ) : null}
      <Text style={styles.subtitle}>{authorName}</Text>
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
        <View style={styles.content}>
          {/* === META ARTIKEL (byline, penerbit, tanggal) === */}

          {/* Konten Artikel */}
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
        <View style={styles.metaBox}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri:
                  article?.source_logo ||
                  "https://onpers.com/img/logo/logo-onpers.png",
              }}
              style={styles.sourceImage}
            />
            <View>
              <Text style={styles.sourceLabel}>Penulis</Text>
              <Text style={styles.sourceText}>{authorName}</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.metaLine}>
              Penerbit:{" "}
              <Text style={styles.metaStrong}>
                {article?.publisher_name ?? "OnPers"}
              </Text>
            </Text>

            {displayedPublished ? (
              <Text style={styles.metaLine}>
                Dipublikasikan:{" "}
                <Text style={styles.metaStrong}>
                  {formatDateTimeFromDB(updatedAt ?? createdAt)}
                </Text>
              </Text>
            ) : null}

            {/* {isDifferent && updatedAt ? (
                <Text style={styles.metaLine}>
                  Diperbarui:{" "}
                  <Text style={styles.metaStrong}>
                    {formatDateTimeFromDB(updatedAt)}
                  </Text>
                </Text>
              ) : null} */}

            {/* Jika agregasi, tampilkan sumber asli */}
            {/* {article?.source_url ? (
                <Text style={styles.metaLine}>
                  Sumber asli:{" "}
                  <Text style={styles.metaStrong}>
                    {article?.source_domain ?? article?.source_url}
                  </Text>
                </Text>
              ) : null} */}
          </View>
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

  // Meta
  metaBox: { paddingHorizontal: 20, marginBottom: 10 },
  metaLine: { fontSize: 13, color: "#444", marginTop: 2 },
  metaStrong: { fontWeight: "600", color: "#111" },
  sourceLabel: { fontSize: 13, color: "#666" },
  sourceText: { fontSize: 16, fontWeight: "bold" },
  sourceImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },

  // Lainnya
  articleText: { fontSize: 16, color: "#333", lineHeight: 24 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ArticleScreen;
