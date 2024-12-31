import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { format, isToday, parseISO } from "date-fns";
import api from "../src/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MessagesScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      console.log(token);
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await api.get("/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Format semua data pengguna dari respons API
      const formattedData = response.data.map((user) => {
        const createdAt = user.latest_message
          ? parseISO(user.created_at)
          : null;

        let time;
        if (createdAt) {
          if (isToday(createdAt)) {
            // Jika waktu pada hari yang sama, gunakan format HH:mm
            time = format(createdAt, "HH:mm");
          } else {
            // Jika sudah melewati tanggal, gunakan format dd/MM/yy HH:mm
            time = format(createdAt, "dd/MM/yy HH:mm");
          }
        } else {
          time = "No messages yet";
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.sender,
          to: user.to,
          message: user.latest_message || "No messages yet",
          time, // Waktu yang diformat
          avatar: "https://via.placeholder.com/50",
          unread: !!user.latest_message,
        };
      });

      setMessages(formattedData);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const renderItem = ({ item }) => {
    // console.log("Nama:", item.name); // Debugging nama
    // console.log("Email:", item.email); // Debugging email

    return (
      <TouchableOpacity
        style={styles.messageCard}
        onPress={() =>
          navigation.navigate("ChatScreen", {
            name: item.name,
            email: item.email,
            to: item.to,
          })
        }
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.messageContent}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.message}
          </Text>
        </View>
        <View style={styles.messageInfo}>
          <Text style={styles.messageTime}>{item.time}</Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <Text style={styles.subHeader}>
        {messages.length > 0
          ? `You have ${messages.length} messages`
          : "No messages"}
      </Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  messageInfo: {
    alignItems: "flex-end",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 10,
    height: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MessagesScreen;
