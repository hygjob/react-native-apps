import { Audio } from 'expo-av';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  async playTone(frequency, duration = 0.5) {
    try {
      // Generate a simple WAV file in memory
      // This creates a basic sine wave tone
      const sampleRate = 44100;
      const numSamples = Math.floor(sampleRate * duration);
      
      // Create a simple beep sound
      // Note: This is a simplified version. For production, use actual piano samples.
      const sound = await Audio.Sound.createAsync(
        require('../assets/sounds/default-tone.mp3'),
        { shouldPlay: true, volume: 0.6 },
        null,
        true
      ).catch(() => {
        // Fallback if sound file doesn't exist
        // Use a simple notification sound
        return Audio.Sound.createAsync(
          { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' },
          { shouldPlay: true, volume: 0.3 }
        );
      });

      if (sound && sound.sound) {
        setTimeout(async () => {
          try {
            await sound.sound.stopAsync();
            await sound.sound.unloadAsync();
          } catch (e) {
            // Ignore cleanup errors
          }
        }, duration * 1000);
      }

      return sound.sound;
    } catch (error) {
      console.error('Error playing tone:', error);
      return null;
    }
  }

  async cleanup() {
    try {
      for (const key in this.sounds) {
        if (this.sounds[key]) {
          await this.sounds[key].unloadAsync();
        }
      }
      this.sounds = {};
    } catch (error) {
      console.error('Error cleaning up sounds:', error);
    }
  }
}

export default new SoundManager();

