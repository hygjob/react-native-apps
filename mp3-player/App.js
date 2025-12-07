import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackName, setTrackName] = useState('No Track Selected');
  const [isBuffering, setIsBuffering] = useState(false);

  // Unload sound when component unmounts
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.error('Error setting audio mode', e);
      }
    };
    setupAudio();

    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const { uri, name } = result.assets[0];
      setTrackName(name);
      loadAudio(uri);

    } catch (error) {
      console.error('Error picking audio:', error);
    }
  };

  const loadAudio = async (uri) => {
    try {
      // Unload existing sound if any
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setDuration(status.durationMillis);
      setPosition(0);
      setIsPlaying(true);

    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
        // Optionally loop or play next
      }
    } else {
      if (status.error) {
        console.error(`Playback Error: ${status.error}`);
      }
    }
  };

  const togglePlayback = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const onSliderValueChange = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MP3 Player</Text>
      </View>

      <View style={styles.albumArtContainer}>
        <View style={styles.albumArt}>
          <Ionicons name="musical-note" size={120} color="#555" />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {trackName}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.sliderContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={onSliderValueChange}
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#555"
            thumbTintColor="#1EB1FC"
            disabled={!sound}
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={pickAudio} style={styles.iconButton}>
             <Ionicons name="folder-open-outline" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={togglePlayback} 
            style={[styles.playButton, !sound && styles.disabledButton]}
            disabled={!sound}
          >
            {isBuffering ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color="#000" 
                style={{ marginLeft: isPlaying ? 0 : 4 }} // visual adjustment for play icon
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} disabled={true}>
            {/* Placeholder for future Playlist feature */}
            <Ionicons name="list-outline" size={30} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  albumArtContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArt: {
    width: 250,
    height: 250,
    backgroundColor: '#2a2a2a',
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  infoContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
  timeText: {
    color: '#ccc',
    fontSize: 12,
    width: 45,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  playButton: {
    width: 70,
    height: 70,
    backgroundColor: '#1EB1FC',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#333',
  }
});
