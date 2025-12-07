import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import PianoKey from './PianoKey';

// Static sound map - only include sounds that exist
// Note: If a require() fails, it will error at module load time
// Make sure all referenced files exist before running the app
const soundFiles = {
  'C4': require('../assets/sounds/C4.mp3'),
  'C#4': require('../assets/sounds/C#4.mp3'),
  'D4': require('../assets/sounds/D4.mp3'),
  'D#4': require('../assets/sounds/D#4.mp3'),
  'E4': require('../assets/sounds/E4.mp3'),
  'F4': require('../assets/sounds/F4.mp3'),
  'F#4': require('../assets/sounds/F#4.mp3'),
  'G4': require('../assets/sounds/G4.mp3'),
  'G#4': require('../assets/sounds/G#4.mp3'),
  'A4': require('../assets/sounds/A4.mp3'),
  'A#4': require('../assets/sounds/A#4.mp3'),
  'B4': require('../assets/sounds/B4.mp3'),
  'C5': require('../assets/sounds/C5.mp3'),
  // Missing second octave files (C#5-B5) - add these for full functionality:
  // 'C#5': require('../assets/sounds/C#5.mp3'),
  // 'D5': require('../assets/sounds/D5.mp3'),
  // 'D#5': require('../assets/sounds/D#5.mp3'),
  // 'E5': require('../assets/sounds/E5.mp3'),
  // 'F5': require('../assets/sounds/F5.mp3'),
  // 'F#5': require('../assets/sounds/F#5.mp3'),
  // 'G5': require('../assets/sounds/G5.mp3'),
  // 'G#5': require('../assets/sounds/G#5.mp3'),
  // 'A5': require('../assets/sounds/A5.mp3'),
  // 'A#5': require('../assets/sounds/A#5.mp3'),
  // 'B5': require('../assets/sounds/B5.mp3'),
};

// Track which sounds failed to load (for runtime checking)
const soundLoadErrors = new Set();

const Piano = () => {
  const [pressedKeys, setPressedKeys] = useState({});
  const soundObjects = useRef({});

  // Define the piano keys (2 octaves)
  const keys = [
    // First octave
    { note: 'C4', isBlack: false, frequency: 261.63 },
    { note: 'C#4', isBlack: true, frequency: 277.18, offset: 32 },
    { note: 'D4', isBlack: false, frequency: 293.66 },
    { note: 'D#4', isBlack: true, frequency: 311.13, offset: 83 },
    { note: 'E4', isBlack: false, frequency: 329.63 },
    { note: 'F4', isBlack: false, frequency: 349.23 },
    { note: 'F#4', isBlack: true, frequency: 369.99, offset: 185 },
    { note: 'G4', isBlack: false, frequency: 392.00 },
    { note: 'G#4', isBlack: true, frequency: 415.30, offset: 236 },
    { note: 'A4', isBlack: false, frequency: 440.00 },
    { note: 'A#4', isBlack: true, frequency: 466.16, offset: 287 },
    { note: 'B4', isBlack: false, frequency: 493.88 },
    
    // Second octave
    { note: 'C5', isBlack: false, frequency: 523.25 },
    { note: 'C#5', isBlack: true, frequency: 554.37, offset: 389 },
    { note: 'D5', isBlack: false, frequency: 587.33 },
    { note: 'D#5', isBlack: true, frequency: 622.25, offset: 440 },
    { note: 'E5', isBlack: false, frequency: 659.25 },
    { note: 'F5', isBlack: false, frequency: 698.46 },
    { note: 'F#5', isBlack: true, frequency: 739.99, offset: 542 },
    { note: 'G5', isBlack: false, frequency: 783.99 },
    { note: 'G#5', isBlack: true, frequency: 830.61, offset: 593 },
    { note: 'A5', isBlack: false, frequency: 880.00 },
    { note: 'A#5', isBlack: true, frequency: 932.33, offset: 644 },
    { note: 'B5', isBlack: false, frequency: 987.77 },
  ];

  // Initialize audio and log available sounds
  React.useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    // Log which sound files are available
    const availableSounds = Object.keys(soundFiles).filter(note => soundFiles[note] !== null && soundFiles[note] !== undefined);
    const missingSounds = keys.map(k => k.note).filter(note => !soundFiles[note]);
    
    console.log('🎹 Piano initialized:');
    console.log(`✅ Available sounds: ${availableSounds.length} -`, availableSounds.join(', '));
    if (missingSounds.length > 0) {
      console.log(`⚠️  Missing sounds: ${missingSounds.length} -`, missingSounds.join(', '));
    }

    return () => {
      // Cleanup all sound objects
      Object.values(soundObjects.current).forEach(async (sound) => {
        if (sound) {
          try {
            await sound.unloadAsync();
          } catch (error) {
            // Ignore cleanup errors
          }
        }
      });
    };
  }, []);

  // Generate a tone using expo-av and haptic feedback
  const playNote = async (note, frequency) => {
    // Always show visual feedback immediately
    setPressedKeys(prev => ({ ...prev, [note]: true }));

    try {
      // Haptic feedback for better user experience
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (hapticError) {
      // Haptic might not be available on all devices, continue anyway
      console.log('Haptic feedback not available');
    }

    // Helper to reset visual feedback
    const resetVisualFeedback = () => {
      setPressedKeys(prev => {
        const newState = { ...prev };
        delete newState[note];
        return newState;
      });
    };

    try {
      // Stop any existing sound for this note (don't let errors here break the flow)
      try {
        if (soundObjects.current[note]) {
          const existingSound = soundObjects.current[note];
          await existingSound.stopAsync();
          await existingSound.unloadAsync();
          delete soundObjects.current[note];
        }
      } catch (stopError) {
        // If stopping fails, just clear the reference
        delete soundObjects.current[note];
      }

      // Try to load and play the sound file if soundFiles is configured
      if (soundFiles && soundFiles[note]) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            soundFiles[note],
            { shouldPlay: true, volume: 0.8 }
          );
          
          // Store sound reference
          soundObjects.current[note] = sound;
          
          // Set up playback status handler
          sound.setOnPlaybackStatusUpdate((status) => {
            try {
              if (status.didJustFinish) {
                resetVisualFeedback();
                // Clean up sound
                if (soundObjects.current[note]) {
                  sound.unloadAsync().catch(() => {}); // Ignore cleanup errors
                  delete soundObjects.current[note];
                }
              }
            } catch (statusError) {
              // Even if status update fails, reset visual feedback
              resetVisualFeedback();
            }
          });
          
          // If sound finishes playing, clean up
          return; // Success - sound is playing
          
        } catch (soundError) {
          // Sound loading/playing failed for this specific note
          console.warn(`❌ Failed to play sound for ${note}:`, soundError.message);
          console.warn(`   Expected file: assets/sounds/${note}.mp3`);
          console.warn(`   Make sure the file exists with exact case matching`);
          soundLoadErrors.add(note);
          
          // Don't break - just show visual feedback
          setTimeout(() => {
            resetVisualFeedback();
          }, 400);
          return;
        }
      } else {
        // If sound files not configured for this note, just show visual feedback
        console.log(`Playing: ${note} at ${frequency.toFixed(2)} Hz (no sound file)`);
        
        // Simulate note duration with visual feedback
        setTimeout(() => {
          resetVisualFeedback();
        }, 400);
      }

    } catch (error) {
      // Catastrophic error - log but don't break other notes
      console.error(`Unexpected error playing note ${note}:`, error);
      soundLoadErrors.add(note);
      
      // Always reset visual feedback even on error
      setTimeout(() => {
        resetVisualFeedback();
      }, 400);
    }
  };

  const handleKeyPress = (note) => {
    const keyData = keys.find(k => k.note === note);
    if (keyData) {
      playNote(note, keyData.frequency);
    }
  };

  // Render white keys
  const whiteKeys = keys.filter(key => !key.isBlack);
  
  // Render black keys
  const blackKeys = keys.filter(key => key.isBlack);

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🎹 Piano App</Text>
        <Text style={styles.subtitle}>Tap the keys to play notes</Text>
      </View>
      
      <ScrollView 
        horizontal 
        style={styles.scrollView}
        contentContainerStyle={styles.pianoContainer}
        showsHorizontalScrollIndicator={true}
      >
        <View style={styles.keysContainer}>
          {/* White keys */}
          <View style={styles.whiteKeysRow}>
            {whiteKeys.map((key) => (
              <PianoKey
                key={key.note}
                note={key.note}
                isBlack={false}
                onPress={handleKeyPress}
                isPressed={pressedKeys[key.note]}
              />
            ))}
          </View>

          {/* Black keys */}
          <View style={styles.blackKeysRow}>
            {blackKeys.map((key) => (
              <View key={key.note} style={{ left: key.offset }}>
                <PianoKey
                  note={key.note}
                  isBlack={true}
                  onPress={handleKeyPress}
                  isPressed={pressedKeys[key.note]}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <LinearGradient
        colors={['#533483', '#7b2cbf', '#9d4edd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.infoContainer}
      >
        <Text style={styles.infoText}>
          🎵 2 Octaves (C4 - B5) • 24 Keys
        </Text>
        <Text style={styles.noteText}>
          🔊 First octave (C4-C5) has sound! Second octave needs MP3 files.
        </Text>
        <Text style={styles.noteText}>
          Add C#5.mp3 through B5.mp3 to assets/sounds/ for full audio
        </Text>
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  pianoContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  keysContainer: {
    position: 'relative',
    height: 250,
  },
  whiteKeysRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  blackKeysRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  infoContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  noteText: {
    fontSize: 12,
    color: '#F0F0F0',
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.9,
    lineHeight: 18,
  },
});

export default Piano;

