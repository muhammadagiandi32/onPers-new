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

const CreateArticleScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category-name"); // Ganti endpoint sesuai backend Anda
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

        window.getEditorContent = function () {
          const content = quill.root.innerHTML;
          console.log("getEditorContent called. Content:", content);
          return content;
        };

        // Kirim data ke React Native setiap kali konten berubah
        quill.on('text-change', () => {
          const content = quill.root.innerHTML;
          console.log("Content changed:", content);
          window.ReactNativeWebView.postMessage(content);
        });
      </script>


    </body>
    </html>
  `;

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
   console.log("Handle Submit button pressed");

   if (!title || !category || !image || !content) {
     console.log("Validation failed:");
     console.log("Title:", title);
     console.log("Category:", category);
     console.log("Image:", image);
     console.log("Content:", content);
     Alert.alert("Error", "Please fill all required fields.");
     return;
   }

   console.log("Content from state before submit:", content);
   if (!content || content.trim() === "<p><br></p>") {
     console.log("Invalid content detected before submit:", content);
     Alert.alert("Error", "Content cannot be empty.");
     setLoading(false);
     return;
   }

   setLoading(true);

   try {
     console.log("Fetching token...");
     const token = await AsyncStorage.getItem("access_token");
     console.log("Token fetched:", token);
     if (!token) {
       Alert.alert("Error", "User is not authenticated.");
       setLoading(false);
       return;
     }

     console.log("Preparing FormData...");
     const formData = new FormData();
     formData.append("judul_berita", title);
     formData.append("content", content);
     formData.append("category", category);
     formData.append("gambar", {
       uri: image.uri,
       type: image.mimeType || "image/jpeg",
       name: image.name,
     });

     console.log("FormData prepared:");
     for (const pair of formData.entries()) {
       console.log(`${pair[0]}: ${pair[1]}`);
     }

     console.log("Sending data to endpoint...");
     const response = await api.post("/post-berita", formData, {
       headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "multipart/form-data",
       },
     });

     console.log("Response received:", response);

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

     if (error.response) {
       console.log("Error response data:", error.response.data);
       console.log("Error response status:", error.response.status);
       console.log("Error response headers:", error.response.headers);
     }

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

        {/* Content */}
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: quillHtmlContent }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={(event) => {
            const htmlContent = event.nativeEvent.data;
            console.log(
              "Data received from WebView in onMessage:",
              htmlContent
            );

            if (!htmlContent || htmlContent.trim() === "<p><br></p>") {
              console.log("Empty content received:", htmlContent);
              Alert.alert("Error", "Content cannot be empty.");
              return;
            }

            // Simpan konten ke state
            setContent(htmlContent);
            console.log("Content saved to state:", htmlContent);
          }}
          onLoadEnd={() => {
            console.log("WebView finished loading");
          }}
          style={{ height: 350 }}
        />

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
