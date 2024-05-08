import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image,TextInput, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {
  Card,
  CardContent,
  CardImage,
  CardSubtitle,
  CardText,
  CardTitle,
} from "../src/components/card";
import tailwind from "twrnc";

const HomeScreen = () => {

  const [images, setImages] = useState([
    { title: 'Baca', uri: 'https://source.unsplash.com/random/1' },
    { title: 'Fiat justitia ruat caelum', uri: 'https://source.unsplash.com/random/2' },
    { title: 'Hendaklah keadilan ditegakkan, walaupun langit akan runtuh.', uri: 'https://source.unsplash.com/random/3' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        
        <View style={styles.header}>
          <Text style={styles.headerText}>Selamat Datang!</Text>
          {/* <TouchableOpacity onPress={toggleSearchInput}> */}
            <View style={styles.searchBar}>
              <AntDesign name="search1" size={24} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
              />
            </View>
          {/* </TouchableOpacity> */}
        </View>
        <View>
          {/* <Text style={styles.text}>Slideshow</Text> */}
          <FlatList
            horizontal
            data={images}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image source={{ uri: item.uri }} style={styles.slideImage} />
                <Text style={[styles.slideTitle, { textAlign: 'center', textAlignVertical: 'center' }]} numberOfLines={null}>
                  {item.title}
                </Text>
              </View>
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="user" size={24} color="white" style={styles.icon} /> 
            <Text style={styles.buttonText}>Wartawan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="addusergroup" size={24} color="white" style={styles.icon} /> 
            <Text style={styles.buttonText}>Narasumber</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="infocirlceo" size={24} color="white" style={styles.icon} /> 
            <Text style={styles.buttonText}>Hummas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="filetext1" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Jasa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="bulb1" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Umum</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="message1" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Pesan</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.text}>Berita!</Text>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}
        >
          <CardBerita/>
          <CardBerita/>
          <CardBerita/>
        </ScrollView>
        <View>
          <Text style={styles.text}>Acara!</Text>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}
        >
          <CardAcara/>
          <CardAcara/>
          <CardAcara/>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const CardBerita =()=>{
  return(
    <Card style={[tailwind`m-1`, styles.card]}>
      <CardContent style={tailwind`gap-1`}>
        <CardTitle>This is a card</CardTitle>
        <CardText>You can use it to display information</CardText>
      </CardContent>
      <CardImage source={{ uri: "https://source.unsplash.com/random" }} />
      <CardContent style={tailwind`gap-1`}>
        <CardSubtitle>Posted by @worldtraveller</CardSubtitle>
        <CardText>2 hours ago</CardText>
      </CardContent>
    </Card>
  );
}

const CardAcara =()=>{
  return(
    <Card style={[tailwind`m-1`, styles.card]}>
      <CardContent style={tailwind`gap-1`}>
        <CardTitle>This is a card</CardTitle>
        <CardText>You can use it to display information</CardText>
      </CardContent>
      <CardImage source={{ uri: "https://source.unsplash.com/random" }} />
      <CardContent style={tailwind`gap-1`}>
        <CardSubtitle>Posted by @worldtraveller</CardSubtitle>
        <CardText>2 hours ago</CardText>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  scrollViewContainer: {
    paddingHorizontal: 16, // Add some padding to the scroll view
  },
  card: {
    height: 450,
    flex: 1, // Make the card take full width
    width: undefined, // Remove the fixed width
    marginHorizontal: 16, // Add some margin to the card
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  slide: {
    margin: 10,
  },
  slideImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;
