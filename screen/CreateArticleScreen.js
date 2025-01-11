import React from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";

const CreateArticleScreen = () => {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>SUBMIT REQUEST</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </Text>
  
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} placeholder="Enter your First Name" />
          </View>
  
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} placeholder="Enter your Last Name" />
          </View>
  
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Id</Text>
            <TextInput style={styles.input} placeholder="Enter your Email Id" keyboardType="email-address" />
          </View>
  
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput style={styles.input} placeholder="Enter your 10 digit mobile number" keyboardType="phone-pad" />
          </View>
  
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput style={styles.input} placeholder="Enter the Subject" />
          </View>
  
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Enter your Message within 400 characters"
              multiline
            />
          </View>
  
          <View style={styles.attachmentSection}>
            <Text style={styles.label}>Attachments</Text>
            <TouchableOpacity style={styles.attachmentButton}>
              <Text style={styles.attachmentText}>Add or Drag & Drop your files here</Text>
            </TouchableOpacity>
          </View>
  
          <Text style={styles.note}>
            Please verify your entered details before submitting.
          </Text>
  
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
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
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: "#333",
      textAlign: "center",
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      color: "#333",
      marginBottom: 4,
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
    textarea: {
      height: 100,
      textAlignVertical: "top",
    },
    attachmentSection: {
      marginBottom: 16,
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
    note: {
      fontSize: 12,
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
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
