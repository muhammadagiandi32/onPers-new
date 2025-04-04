import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "./screen/HomeScreen";
import ProfileScreen from "./screen/ProfileScreen";
import ArticleScreen from "./screen/ArticleScreen";
import LoginScreen from "./screen/LoginScreen";
import MessagesScreen from "./screen/MessagesScreen"; // Import MessagesScreen
import ChatScreen from "./screen/ChatScreen"; // Import ChatScreen
import CreateArticleScreen from "./screen/CreateArticleScreen";
import RegisterScreen from "./screen/RegisterScreen";
import ViewAllScreen from "./screen/ViewAllScreen";
import EditArticleScreen from "./screen/EditArticleScreen";
import EditViewScreen from "./screen/EditViewScreen";
import ShortsScreen from "./screen/ShortsScreen";
import CategoryMessagesScreen from "./screen/CategoryMessagesScreen";
import FotoScreen from "./screen/FotoScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="ArticleScreen"
        component={ArticleScreen}
        options={{ title: "Article", headerShown: false }}
      />
      <Stack.Screen
        name="FotoScreen"
        component={FotoScreen}
        options={{ title: "Foto", headerShown: false }}
      />
      <Stack.Screen
        name="ViewAllScreen"
        component={ViewAllScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditArticleScreen"
        component={EditArticleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryMessagesScreen"
        component={CategoryMessagesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ title: "Chat", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Messages Stack Navigator
function MessagesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessagesScreen"
        component={MessagesScreen}
        options={{ title: "Messages", headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ title: "Chat", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Messages Stack Navigator
function CreateArticleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreateArtickeScreen"
        component={CreateArticleScreen}
        options={{ title: "Create", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Status login pengguna

  // Cek status login saat aplikasi dimulai
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        setIsLoggedIn(!!token); // Set true jika token ada
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  // Tampilkan layar loading sementara memeriksa status login
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline";
              } else if (route.name === "Messages") {
                iconName = focused ? "chatbubble" : "chatbubble-outline";
              } else if (route.name === "Edit") {
                iconName = focused ? "document-text" : "document-text-outline";
              } else if (route.name === "CreateArticle") {
                iconName = focused ? "add-circle" : "add-circle-outline";
              } else if (route.name === "EditArticleScreen") {
                iconName = focused ? "document-text" : "document-text-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#FF4C4C", // Warna ikon aktif
            tabBarInactiveTintColor: "#666", // Warna ikon tidak aktif
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Messages"
            component={MessagesStack} // Gunakan MessagesStack
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="CreateArticle"
            component={CreateArticleStack} // Gunakan CreateArticleStack
            options={{
              headerShown: false,
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  style={{
                    top: -3, // Membuat tombol naik ke atas
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FF4C4C", // Warna lingkaran tombol
                    borderRadius: 35, // Membuat tombol berbentuk lingkaran
                    height: 50, // Tinggi lingkaran tombol
                    width: 50, // Lebar lingkaran tombol
                    shadowColor: "#000", // Warna bayangan
                    shadowOffset: { width: 0, height: 10 }, // Posisi bayangan
                    shadowOpacity: 4, // Transparansi bayangan
                    shadowRadius: 3, // Jangkauan bayangan
                    elevation: 3, // Bayangan untuk Android
                  }}
                >
                  <Ionicons name="add" size={36} color="white" />
                  {/* Ikon "+" */}
                </TouchableOpacity>
              ),
            }}
          />
          <Tab.Screen
            name="Edit"
            component={EditViewScreen} // Gunakan EditArticleStack
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Profile"
            children={() => <ProfileScreen setIsLoggedIn={setIsLoggedIn} />}
            options={{ headerShown: false }}
          />
          {/* <Tab.Screen
            name="Shorts"
            children={() => <ShortsScreen setIsLoggedIn={setIsLoggedIn} />}
            options={{ headerShown: false }}
          /> */}
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          {/* Login hanya tersedia di Stack.Navigator saat belum login */}
          <Stack.Screen
            name="Login"
            children={() => <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
