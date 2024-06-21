import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image,TextInput, FlatList , ActivityIndicator} from 'react-native';
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
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch data from the API endpoint
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MTU2NzcyNDAsImV4cCI6MTcxNTY4MDg0MCwibmJmIjoxNzE1Njc3MjQwLCJqdGkiOiJTaXc0MjF0YXdJYlJwMmtCIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.70mWP4qxPHcwIzWqBbWn3McAQpQcznvP-Zky2NRlO_Y';

    // Konfigurasi header dengan bearer token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Jika diperlukan
    };

    axios.get('http://10.0.2.2:8000/api/news', { headers })
      .then(response => {
        const data = response.data;
        // console.log(data.data);
        setNewsData(data.data);
        // setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setNewsData(false);
        // setLoading(false);
      });
  }, []);

  const [dataIklan, setDataIklan] = useState([]);
  useEffect(() => {
    const category = 'Technology';
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MTU2NzcyNDAsImV4cCI6MTcxNTY4MDg0MCwibmJmIjoxNzE1Njc3MjQwLCJqdGkiOiJTaXc0MjF0YXdJYlJwMmtCIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.70mWP4qxPHcwIzWqBbWn3McAQpQcznvP-Zky2NRlO_Y';

    // Konfigurasi header dengan bearer token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Jika diperlukan
    };

    axios.get(`http://10.0.2.2:8000/api/news/iklan/${category}`, { headers })
      .then(response => {
        const data = response.data;
        // console.log(data.data);
        setDataIklan(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // setLoading(false);
      });
    }, []);

  const onPressCard = (uuid) => {
    console.log(uuid);

    navigation.navigate('ArticleScreen', { uuid });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Selamat Datang!</Text>
            <View style={styles.searchBar}>
              <AntDesign name="search1" size={24} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
              />
            </View>
        </View>
        <View>
          {/* <Text>Berita Popular!</Text> */}
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              horizontal
              data={dataIklan}
              keyExtractor={(item, index) => item.title + index}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onPressCard(item.id)}>
                  <View style={styles.slide}>
                    <Image source={{ uri: item.image_url }} style={styles.slideImage} />
                    <Text  style={[styles.slideTitle, { textAlign: 'center', textAlignVertical: 'center' }]}
                    numberOfLines={null}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
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
            <AntDesign name="customerservice" size={24} color="white" style={styles.icon} /> 
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
            <AntDesign name="infocirlceo" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Info</Text>
          </TouchableOpacity>
        </View>
        {/* Berita */}
        <View>
          <Text style={styles.text}>Berita!</Text>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}
        >
          {/* Menggunakan CardBerita dengan props newsData */}
          <CardBerita newsData={newsData} />
        </ScrollView>
        {/* End Berita */}
        {/* Acara */}
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
        {/* End Acara */}
        {/* Rilis */}
        <View>
          <Text style={styles.text}>Rilis</Text>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}
        >
          <CardRilis/>
          <CardRilis/>
          <CardRilis/>
        </ScrollView>
        {/* End Rilis */}
      </ScrollView>
    </SafeAreaView>
  );
};

const CardBerita = ({ newsData }) => {
  if(newsData == false){
    return <ActivityIndicator size="large" color="#007AFF"></ActivityIndicator>
  }
  console.log(newsData);
  const navigation = useNavigation();

  const onPressBerita = (uuid) => {
    navigation.navigate('ArticleScreen', { uuid });
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {newsData.map((newsItem, index) => (
        <TouchableOpacity key={index}  onPress={() => onPressBerita(newsItem.id)}>
          <Card style={styles.card}>
            <CardImage source={{ uri: newsItem.image_url }} style={styles.slideImageCard}/>
            <CardContent style={tailwind`gap-1`}>
              <CardTitle>{newsItem.title}</CardTitle>
              <CardSubtitle>Posted by {newsItem.author.name}</CardSubtitle>
            </CardContent>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}




const CardAcara = () => {
  return (
    <Card style={[tailwind`m-1`, styles.card]}>
      <TouchableOpacity onPress={() => console.log('Berita Card')}>
        <CardImage source={{ uri: "https://source.unsplash.com/random" }} />
        <CardContent style={tailwind`gap-1`}>
          <CardTitle>This is a card</CardTitle>
          <CardSubtitle>Posted by @worldtraveller</CardSubtitle>
        </CardContent>
      </TouchableOpacity>
    </Card>
  );
}

const CardRilis = () => {
  return (
    <Card style={[tailwind`m-1`, styles.card]}>
      <TouchableOpacity onPress={() => console.log('Berita Card')}>
        <CardImage source={{ uri: "https://source.unsplash.com/random" }} />
        <CardContent style={tailwind`gap-1`}>
          <CardTitle>This is a card</CardTitle>
          <CardSubtitle>Posted by @worldtraveller</CardSubtitle>
          {/* <CardText>2 hours ago</CardText> */}
        </CardContent>
      </TouchableOpacity>
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
    // height: 450,
    flex: 1, // Make the card take full width
    width: 300, // Remove the fixed width
    height: undefined,
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
    width: 400,
    height: 200,
    borderRadius: 10,
  },
  slideImageCard:{
    width:300,
    height:250,
    borderRadius:10
  },
  slideTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', // Center the text
  },
});

export default HomeScreen;
