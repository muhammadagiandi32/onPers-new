import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import api from "../src/utils/api";
import { useRoute } from '@react-navigation/native';



const ViewAllScreen = ({navigation}) => {
  const { params } = useRoute();
  const [beriataAllNews, setBeriataAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = params?.category; 

  console.log(category,'param nih');
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/category?category=${category}&viewAll=y`);
        console.log("sukses get data");
        setBeriataAllNews(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  },[category]);

  const renderArticle = ({ item }) => (
    <TouchableOpacity style={styles.articleContainer} onPress={() =>
        navigation.navigate("ArticleScreen", { slug: item.slug })
      }>
      <Image source={{ uri: item.image_url }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleAuthor}>By {item.author_id || "Unknown"}</Text>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleTime}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>News</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Text style={styles.icon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.icon}>🙂</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabBar}>
            <TouchableOpacity onPress={() => navigation.navigate("ViewAllScreen", { category: 'All' })}>
                <Text style={[styles.tabItem, category === 'All' && styles.activeTab]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ViewAllScreen", { category: 'Berita' })}>
                <Text style={[styles.tabItem, category === 'Berita' && styles.activeTab]}>Berita</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ViewAllScreen", { category: 'Acara' })}>
                <Text style={[styles.tabItem, category === 'Acara' && styles.activeTab]}>Acara</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ViewAllScreen", { category: 'Advertorial' })}>
                <Text style={[styles.tabItem, category === 'Advertorial' && styles.activeTab]}>Advertorial</Text>
            </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF4C4C" style={styles.loader} />
        ) : (
          <FlatList
            data={beriataAllNews}
            renderItem={renderArticle}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.articleList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FF4C4C',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  icon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    paddingVertical: 10,
    color: '#999999',
    fontSize: 16,
  },
  activeTab: {
    color: '#FF4C4C',
    borderBottomWidth: 2,
    borderBottomColor: '#FF4C4C',
  },
  articleList: {
    padding: 20,
  },
  articleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  articleAuthor: {
    color: '#999999',
    fontSize: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  articleTime: {
    fontSize: 12,
    color: '#999999',
  },
  loader: {
    marginTop: 20,
  },
});

export default ViewAllScreen;
