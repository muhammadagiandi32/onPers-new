import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { default as PagerView } from "react-native-pager-view";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const videos = [
  {
    id: 1,
    uri: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    uri: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 3,
    uri: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

const ShortsScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const videoRefs = useRef([]);
  const [videoDurations, setVideoDurations] = useState({});
  const [currentTime, setCurrentTime] = useState(0);

  const handlePageChange = (event) => {
    const pageIndex = event.nativeEvent.position;
    setCurrentPage(pageIndex);
  };

  const handlePlaybackStatusUpdate = (status, index) => {
    if (status?.durationMillis && status?.positionMillis) {
      setVideoDurations((prev) => ({
        ...prev,
        [index]: {
          duration: status.durationMillis,
          current: status.positionMillis,
        },
      }));
      setCurrentTime(status.positionMillis);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <PagerView
      style={styles.pagerView}
      initialPage={0}
      orientation="vertical"
      onPageSelected={handlePageChange}
    >
      {videos.map((video, index) => (
        <View key={video.id} style={styles.page}>
          {/* Video */}
          <Video
            ref={(ref) => (videoRefs.current[index] = ref)}
            source={{ uri: video.uri }}
            style={styles.video}
            resizeMode="cover"
            shouldPlay={index === currentPage}
            isLooping
            onPlaybackStatusUpdate={(status) =>
              handlePlaybackStatusUpdate(status, index)
            }
          />

          {/* Overlay Icons */}
          <View style={styles.overlayContainer}>
            {/* Tombol Kembali */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("HomeScreen")}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Tombol Interaksi (Like & Share) */}
            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.icon}>
                <Ionicons name="heart-outline" size={35} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Ionicons name="chatbubble-outline" size={35} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Ionicons name="share-outline" size={35} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Ionicons name="ellipsis-horizontal" size={35} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar & Durasi */}
          <View style={styles.durationContainer}>
            <View style={styles.progressBar}>
              <View
                style={{
                  height: "100%",
                  width: `${
                    (videoDurations[index]?.current /
                      videoDurations[index]?.duration) *
                      100 || 0
                  }%`,
                  backgroundColor: "#fff",
                }}
              />
            </View>
            {/* <Text style={styles.durationText}>
              {formatTime(videoDurations[index]?.current || 0)} /{" "}
              {formatTime(videoDurations[index]?.duration || 0)}
            </Text> */}
          </View>
        </View>
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlayContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
  },
  rightIcons: {
    position: "absolute",
    right: 10,
    bottom: 80,
    alignItems: "center",
  },
  icon: {
    marginBottom: 15,
  },
  durationContainer: {
    position: "absolute",
    bottom: 1,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 2,
    marginBottom: 5,
  },
  durationText: {
    color: "white",
    fontSize: 14,
  },
});

export default ShortsScreen;
