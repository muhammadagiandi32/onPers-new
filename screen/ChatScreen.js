import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../src/utils/api";

const ChatScreen = ({ route, navigation }) => {
  const { email, name, to } = route.params; // Assumes email is passed in params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${email}/${to}`);
      console.log("Fetched messages:", response.data);

      // Pastikan mengambil `data` dari respons
      setMessages(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.log("Error fetching messages", error);
      setMessages([]); // Set ke array kosong jika terjadi error
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Ambil email pengirim dari AsyncStorage
      // const senderEmail = await AsyncStorage.getItem("user_email"); // Pastikan email pengirim disimpan saat login

      if (!email) {
        console.error("No sender email found");
        return;
      }

      // Data yang akan dikirim
      const messageData = {
        sender: email, // Email pengirim
        to: to, // Email penerima
        message: newMessage, // Pesan yang diketik
      };

      // Kirim data ke endpoint backend
      await api.post("/messages/post", messageData);

      // Perbarui daftar pesan lokal
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          sender_email: email,
          id: Math.random().toString(), // ID sementara untuk UI
          created_at: new Date().toISOString(),
        },
      ]);

      // Reset input
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("MessagesScreen")}>
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
      <ScrollView contentContainerStyle={styles.chatContent}>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message, index) => (
            <View
              key={message.id || index}
              style={[
                styles.messageBubble,
                message.sender === email ? styles.you : styles.other, // Periksa pengirim
              ]}
            >
              <Text style={styles.messageText}>{message.message}</Text>
              {/* Tampilkan pesan */}
              <Text style={styles.messageTime}>
                {new Date(message.created_at).getTime() >
                new Date().getTime() - 60000
                  ? "Now" // Jika pesan dikirim dalam 1 menit terakhir
                  : new Date(message.created_at).toLocaleTimeString()}{" "}
                {/* Format waktu */}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            No messages yet.
          </Text>
        )}
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatStatus: {
    fontSize: 14,
    color: "#666",
  },
  chatContent: {
    padding: 20,
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
