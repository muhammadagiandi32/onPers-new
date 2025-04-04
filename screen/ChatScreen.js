import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../src/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = ({ route, navigation }) => {
  const { email, name, to } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef(null);
  const [emailUser, setEmailUser] = useState(""); // Simpan email user yang login

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const dataEmail = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataEmailUser = dataEmail.data.user.email;
      setEmailUser(dataEmailUser); // Simpan email user di state

      // Gunakan dataEmailUser (bukan emailUser yang belum diperbarui)
      const response = await api.get(`/messages/${dataEmailUser}/${email}`);
      const sortedMessages = Array.isArray(response.data.data)
        ? response.data.data.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          )
        : [];

      setMessages((prevMessages) => {
        if (JSON.stringify(prevMessages) !== JSON.stringify(sortedMessages)) {
          return sortedMessages;
        }
        return prevMessages;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [email, to]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = await AsyncStorage.getItem("access_token");

      // Ambil email user yang sedang login
      const userResponse = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const senderEmail = userResponse.data.user.email; // Email pengguna login

      const messageData = {
        sender: senderEmail, // Menggunakan sender_email sesuai backend
        to: email, // Kirim ke email tujuan
        message: newMessage,
      };

      await api.post("/messages/post", messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          id: Math.random().toString(),
          created_at: new Date().toISOString(),
        },
      ]);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message", error.response?.data || error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 1 : 80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.chatName}>{name}</Text>
                <Text style={styles.chatStatus}>Online now</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="call" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.chatContent}
            >
              {messages.map((message, index) => (
                <View
                  key={message.id || index}
                  style={[
                    styles.messageBubble,
                    message.sender === emailUser ? styles.you : styles.other, // Perbaikan disini
                  ]}
                >
                  <Text style={styles.messageText}>{message.message}</Text>
                  <Text style={styles.messageTime}>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message"
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chatStatus: {
    fontSize: 14,
    color: "#666",
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  you: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  other: {
    backgroundColor: "#009990",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  messageTime: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});

export default ChatScreen;
