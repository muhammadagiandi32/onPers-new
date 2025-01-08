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

const ChatScreen = ({ route, navigation }) => {
  const { email, name, to } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef(null);
  const socket = useRef(null);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${email}/${to}`);
        const sortedMessages = Array.isArray(response.data.data)
          ? response.data.data.sort(
              (a, b) => new Date(a.created_at) - new Date(b.created_at)
            )
          : [];
        setMessages((prevMessages) => {
          // Periksa apakah ada perubahan pada pesan
          if (JSON.stringify(prevMessages) !== JSON.stringify(sortedMessages)) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
            return sortedMessages;
          }
          return prevMessages;
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // Panggil fetchMessages pertama kali
    fetchMessages();

    // Set interval untuk polling
    const interval = setInterval(fetchMessages, 3000); // Setiap 3 detik

    // Bersihkan interval saat komponen unmount
    return () => clearInterval(interval);
  }, [email, to]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${email}/${to}`);
      const sortedMessages = Array.isArray(response.data.data)
        ? response.data.data.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          )
        : [];
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        sender: email,
        to: to,
        message: newMessage,
      };

      // Kirim pesan ke server via REST API
      await api.post("/messages/post", messageData);

      // Tambahkan pesan lokal
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          sender_email: email,
          id: Math.random().toString(),
          created_at: new Date().toISOString(),
        },
      ]);

      setNewMessage("");
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 1 : 80} // Offset untuk Android
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.navigate("MessagesScreen")}
              >
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
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.map((message, index) => (
                <View
                  key={message.id || index}
                  style={[
                    styles.messageBubble,
                    message.sender === email ? styles.you : styles.other,
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
  noMessages: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
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
