import React, { useState, useEffect } from "react";
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
import api from "../src/utils/api"; // Import API instance
import { Picker } from "@react-native-picker/picker"; // Import Picker

const CreateArticleScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch daftar kategori dari server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category-name"); // Ganti endpoint sesuai backend Anda
        if (response.data.success) {
          setCategories(response.data.data);
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

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      if (!result.canceled) {
        const file = result.assets ? result.assets[0] : result;
        if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          Alert.alert("Invalid File", "Please select a valid image file.");
          return;
        }
        setImage(file);
        Alert.alert("File Selected", file.name);
      } else {
        Alert.alert("Cancelled", "File selection was cancelled.");
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      Alert.alert("Error", "An error occurred while selecting the file.");
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !category || !image) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("judul_berita", title);
      formData.append("content", content);
      formData.append("category", category); // Mengirim UUID kategori
      formData.append("gambar", {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: image.name,
      });

      const response = await api.post("/post-berita", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);

      if (response.status === 201) {
        Alert.alert("Success", "Article submitted successfully!");
        setTitle("");
        setContent("");
        setCategory("");
        setImage(null);
      } else {
        Alert.alert("Error", "Failed to submit article.");
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      setLoading(false);
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred while submitting."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>CREATE ARTICLE</Text>

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        {/* Content */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter the Content"
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>

        {/* Image */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={handleFilePicker}
          >
            <Text style={styles.attachmentText}>
              {image ? image.name : "Select an image"}
            </Text>
          </TouchableOpacity>

          {/* Preview Gambar */}
          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEEDED",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4C4C",
    textAlign: "center",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
  },
  attachmentButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  attachmentText: {
    fontSize: 14,
    color: "#666",
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: "contain",
  },
  submitButton: {
    backgroundColor: "#FF4C4C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateArticleScreen;
