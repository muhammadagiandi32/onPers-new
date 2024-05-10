import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './screen/HomeScreen'; 
import ProfileScreen from './screen/ProfileScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeStackScreen"
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileStackScreen"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedScreen"
        component={ProfileScreen}
        options={{ title: 'Feed', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AddStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddScreen"
        component={ProfileScreen}
        options={{ title: 'Add', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function PesanStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PesanScreen"
        component={ProfileScreen}
        options={{ title: 'Pesan', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Feed') {
              iconName = focused ? 'bulb' : 'bulb-outline';
            } else if (route.name === 'Add') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              size += 10;
            } else if (route.name === 'Pesan') {
              iconName = focused ? 'mail-open-outline' : 'mail-outline';
            }

            return <Ionicons name={iconName} size={size} color={color}  />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Feed" component={FeedStack} />
        <Tab.Screen name="Add" component={AddStack} />
        <Tab.Screen name="Pesan" component={PesanStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>

    </NavigationContainer>
  );
}
