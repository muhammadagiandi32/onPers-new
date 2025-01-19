import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import api from "../src/utils/api";
import { Picker } from "@react-native-picker/picker";
import { WebView } from "react-native-webview";

const EditArticleScreen = ({ route }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);
  const { slug } = route.params;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category-name");
        if (response.data.success) {
          const filteredCategories = response.data.data.filter((cat) =>
            ["Berita", "Acara"].includes(cat.name)
          );
          setCategories(filteredCategories);
        } else {
          Alert.alert("Error", "Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Error", "An error occurred while fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          setLoading(false);
          return;
        }

        const response = await api.get(`/news-details/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const article = response.data.data;
          setTitle(article.title);
          setContent(article.content);
          setCategory(article.category_id);
          setImage({ uri: article.image_url });
        } else {
          Alert.alert("Error", "Failed to fetch article details.");
        }
      } catch (error) {
        console.error("Error fetching article details:", error);
        Alert.alert(
          "Error",
          "An error occurred while fetching article details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [slug]);

  const quillHtmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quill Editor</title>
    <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      #editor-container {
        flex: 1;
        margin: 20px;
        height: 300px;
      }
    </style>
  </head>
  <body>
    <div id="editor-container"></div>
   <script>
        const quill = new Quill('#editor-container', {
            theme: 'snow',
            placeholder: 'Start typing here...',
        });

        // Fungsi untuk menerima konten dari React Native
        function setContentFromReactNative(content) {
            console.log("Received content in WebView:", content);
            quill.root.innerHTML = content;
        }

        // Kirim data ke React Native setiap kali konten berubah
        quill.on('text-change', () => {
            const content = quill.root.innerHTML;
            window.ReactNativeWebView.postMessage(content);
        });
    </script>

  </body>
  </html>
`;

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (!result.canceled) {
        const file = result.assets ? result.assets[0] : result;
        if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          Alert.alert("Invalid File", "Please select a valid image file.");
          return;
        }
        setImage(file);
      } else {
        Alert.alert("Cancelled", "File selection was cancelled.");
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      Alert.alert("Error", "An error occurred while selecting the file.");
    }
  };

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      console.log("Token:", token, "Slug:", slug);

      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("judul_berita", title);
      formData.append("category", category);
      formData.append("content", content);

      // Tambahkan gambar hanya jika ada
      if (image) {
        formData.append("gambar", {
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          name: image.name || "image.jpg",
        });
      }

      console.log("FormData:", Array.from(formData.entries()));

      const response = await api.post(`/update-berita/${slug}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Article updated successfully!");
      } else {
        Alert.alert("Error", "Failed to submit article.");
      }
    } catch (error) {
      console.error("Error submitting article:", {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred while submitting."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>EDIT ARTICLE</Text>

        <Text>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />

        <Text>Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>

        <Text>Content</Text>
        <WebView
          ref={webViewRef}
          source={{ html: quillHtmlContent }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadEnd={() => {
            if (content) {
              const injectedJS = `
        if (window.setContentFromReactNative) {
          window.setContentFromReactNative(\`${content
            .replace(/`/g, "\\`")
            .replace(/\\/g, "\\\\")}\`);
        }
      `;
              webViewRef.current.injectJavaScript(injectedJS);
            }
          }}
          style={{ height: 350 }}
        />

        <Text>Image</Text>
        <TouchableOpacity
          onPress={handleFilePicker}
          style={styles.attachmentButton}
        >
          <Text>{image ? image.name : "Select Image"}</Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FFF" />
          ) : (
            <Text>Update</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EEEDED" },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4C4C",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
  },
  picker: { backgroundColor: "#FFF" },
  attachmentButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 16,
  },
  imagePreview: { width: 100, height: 100 },
  submitButton: {
    backgroundColor: "#FF4C4C",
    padding: 16,
    alignItems: "center",
  },
});

export default EditArticleScreen;
