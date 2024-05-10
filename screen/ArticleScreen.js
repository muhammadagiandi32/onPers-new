import React,{ useState, useEffect } from 'react';
import { View, ImageBackground, Text, ScrollView } from 'react-native';
import axios from 'axios';

const ArticleScreen = ({route}) => {
    const { uuid } = route.params;
    console.log(uuid);

    const [newsData, setNewsData] = useState(null); // Inisialisasi state dengan null

    useEffect(() => {
        // Fetch data from the API endpoint
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MTUzNTIxMDYsImV4cCI6MTcxNTM1NTcwNiwibmJmIjoxNzE1MzUyMTA2LCJqdGkiOiJIVHBwM1ljMU5PVmE1UkxzIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.RbinstgSrzu2Y_9srNsX5lYSJ4RhXMxan0Q4qtSxc3k';

        // Konfigurasi header dengan bearer token
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Jika diperlukan
        };

        axios.get(`http://10.0.2.2:8000/api/news/get-detail-uuid/${uuid}`, { headers })
            .then(response => {
                const dataNews = response.data.data;
                setNewsData(dataNews); // Simpan data berita ke dalam state
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    if (!newsData) {
        // Tampilkan pesan loading jika data belum diambil
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
            <ImageBackground
                source={{
                    uri: newsData.image_url, // Gunakan dataNews dari state
                }}
                style={{
                    width: '100%',
                    height: 200,
                    resizeMode: 'cover',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: 'white',
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: 2, height: 2 },
                        textShadowRadius: 4,
                    }}
                >
                    {newsData.title} {/* Gunakan dataNews dari state */}
                </Text>
            </ImageBackground>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>
                    Article summary or introduction
                </Text>
                <Text style={{ fontSize: 16, textAlign:'justify' }}>
                    {newsData.content} {/* Gunakan dataNews dari state */}
                </Text>
            </View>
        </ScrollView>
    );
};

export default ArticleScreen;
