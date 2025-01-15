import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../src/utils/api";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; // Import Picker

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [role, setRole] = useState(""); // State for selected role
  const [media, setMedia] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !role || !media || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        name,
        role,
        media,
        email: email.toLowerCase(),
        password,
        password_confirmation: confirmPassword,
      };

      console.log("Request Body:", requestBody);
      const response = await api.post("/register", requestBody);
      console.log("Response Data:", response.data);

      Alert.alert("Success", "Registration successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.log("Registration Error:", error);
      console.log("Error Response:", error.response?.data);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      {/* Role Dropdown */}
      <Text style={styles.label}>Role</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a role" value="" />
          <Picker.Item label="Umum" value="Umum" />
          <Picker.Item label="Wartawan" value="Wartawan" />
          <Picker.Item label="Narasumber" value="Narasumber" />
          <Picker.Item label="Jasa" value="Jasa" />
          <Picker.Item label="Humas" value="Humas" />
        </Picker>
      </View>

      <Text style={styles.label}>Media / Instansi</Text>
      <TextInput
        style={styles.input}
        placeholder="Media (e.g., onPers)"
        value={media}
        onChangeText={setMedia}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default RegisterScreen;
