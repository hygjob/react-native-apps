import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation }) => {
  const { video } = route.params;
  
  const player = useVideoPlayer(video.videoUrl, (player) => {
    player.loop = false;
    player.play();
  });

  const handleLike = () => {
    // Handle like functionality
  };

  const handleDislike = () => {
    // Handle dislike functionality
  };

  const handleShare = () => {
    // Handle share functionality
  };

  const handleSave = () => {
    // Handle save functionality
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            nativeControls
            contentFit="contain"
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>

        {/* Video Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{video.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {video.views} views • {video.uploadDate}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <MaterialIcons name="thumb-up" size={24} color="#606060" />
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDislike}>
              <MaterialIcons name="thumb-down" size={24} color="#606060" />
              <Text style={styles.actionText}>Dislike</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <MaterialIcons name="share" size={24} color="#606060" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <MaterialIcons name="download" size={24} color="#606060" />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Channel Info */}
          <View style={styles.channelContainer}>
            <View style={styles.channelInfo}>
              <View style={styles.channelImageContainer}>
                <Text style={styles.channelInitial}>
                  {video.channelName.charAt(0)}
                </Text>
              </View>
              <View style={styles.channelDetails}>
                <Text style={styles.channelName}>{video.channelName}</Text>
                <Text style={styles.subscriberCount}>1.2M subscribers</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>SUBSCRIBE</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{video.description}</Text>
            <Text style={styles.showMoreText}>Show more</Text>
          </View>
        </View>

        {/* Suggested Videos Section */}
        <View style={styles.suggestedContainer}>
          <Text style={styles.suggestedTitle}>Suggested</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    width: width,
    height: (width * 9) / 16, // 16:9 aspect ratio
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#606060',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  actionText: {
    fontSize: 12,
    color: '#606060',
    marginTop: 4,
  },
  channelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channelInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#606060',
  },
  channelDetails: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  subscriberCount: {
    fontSize: 14,
    color: '#606060',
  },
  subscribeButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: '#606060',
    fontWeight: '500',
  },
  suggestedContainer: {
    padding: 16,
    paddingTop: 0,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
});

export default VideoPlayerScreen;

