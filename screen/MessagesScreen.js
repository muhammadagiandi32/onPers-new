import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { format, isToday, parseISO } from "date-fns";
import api from "../src/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const MessagesScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchMessages = async (retryCount = 3, delay = 2000) => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("access_token");
      // console.log(token);
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const cacheKey = `cached_messages_${token}`;

      // ADD: Cek apakah ada cache untuk token ini sebelum request API
      const cachedMessages = await AsyncStorage.getItem(cacheKey);
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }

      // Hapus semua cache lain yang bukan milik token ini
      const keys = await AsyncStorage.getAllKeys();
      const messagesKeys = keys.filter((key) =>
        key.startsWith("cached_messages_")
      );
      for (const key of messagesKeys) {
        if (key !== cacheKey) {
          await AsyncStorage.removeItem(key);
        }
      }

      const response = await api.get("/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dataEmail = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dataEmailUser = dataEmail.data.user.email;
      const users = Array.isArray(response.data) ? response.data : [];

      let groupedMessages = {};

      users.forEach((user) => {
        if (!user.messages || user.messages.length === 0) return;

        user.messages.forEach((msg) => {
          const createdAt = parseISO(msg.created_at);

          if (
            !groupedMessages[user.id] ||
            groupedMessages[user.id].createdAt < createdAt
          ) {
            groupedMessages[user.id] = {
              id: user.id.toString(),
              name: user.name || "Unknown",
              email: user.email,
              to: msg.to || "",
              message: msg.message,
              time: isToday(createdAt)
                ? format(createdAt, "HH:mm")
                : format(createdAt, "dd/MM/yy HH:mm"),
              createdAt,
              avatar: "https://via.placeholder.com/50",
              unread: !msg.read_at,
            };
          }
        });
      });

      const formattedData = Object.values(groupedMessages)
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter((msg) => msg.email !== dataEmailUser);

      setMessages(formattedData);

      // ADD: Simpan cache hanya untuk token ini
      await AsyncStorage.setItem(cacheKey, JSON.stringify(formattedData));
    } catch (error) {
      if (error.response && error.response.status === 429 && retryCount > 0) {
        console.warn(
          `Rate limit exceeded. Retrying in ${delay / 1000} seconds...`
        );
        setTimeout(() => fetchMessages(retryCount - 1, delay * 2), delay);
      } else {
        console.error("Failed to fetch messages:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [])
  );

  const renderItem = useCallback(({ item }) => {
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
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No messages available</Text>
          }
        />
      </View>
    </SafeAreaView>
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
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
});

export default MessagesScreen;
