import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import api from "../src/utils/api";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [media, setMedia] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !role || !media || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Semua kolom wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak cocok!");
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

      Alert.alert("Success", "Pendaftaran berhasil!");
      navigation.navigate("Login");
    } catch (error) {
      console.log("Registration Error:", error);
      console.log("Error Response:", error.response?.data);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Pendaftaran gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Daftar Akun</Text>

        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama lengkap"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Pilih Peran</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih peran Anda" value="" />
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
          placeholder="Masukkan nama media atau instansi"
          value={media}
          onChangeText={setMedia}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email aktif"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Buat password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Konfirmasi Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Ulangi password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Sudah punya akun? Masuk</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
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
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
});

export default RegisterScreen;
