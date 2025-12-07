import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const VideoCard = ({ video, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
        <View style={styles.durationContainer}>
          <Text style={styles.duration}>{video.duration}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Image
          source={{ uri: video.channelImage }}
          style={styles.channelImage}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {video.title}
          </Text>
          <Text style={styles.channelName}>{video.channelName}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{video.views} views</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{video.uploadDate}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={20} color="#606060" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  thumbnailContainer: {
    position: 'relative',
    width: width,
    height: (width * 9) / 16, // 16:9 aspect ratio
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  durationContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  duration: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 16,
  },
  channelImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
    lineHeight: 20,
  },
  channelName: {
    fontSize: 13,
    color: '#606060',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#606060',
  },
  metaDot: {
    fontSize: 13,
    color: '#606060',
    marginHorizontal: 4,
  },
  moreButton: {
    padding: 4,
    justifyContent: 'center',
  },
});

export default VideoCard;

