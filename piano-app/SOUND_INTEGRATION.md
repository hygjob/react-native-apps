/**
 * Example: How to integrate real piano sounds
 * 
 * IMPORTANT: React Native's Metro bundler does NOT support dynamic requires!
 * You CANNOT use: require(`../assets/sounds/${note}.mp3`)
 * You MUST use a static sound map as shown below.
 */

// Step 1: Add your MP3 files to assets/sounds/
// Files needed: C4.mp3, C#4.mp3, D4.mp3, D#4.mp3, E4.mp3, F4.mp3, F#4.mp3, etc.

// Step 2: In components/Piano.js, uncomment and use the soundFiles map at the top:

// Replace this line:
const soundFiles = null;

// With this:
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
  'C#5': require('../assets/sounds/C#5.mp3'),
  'D5': require('../assets/sounds/D5.mp3'),
  'D#5': require('../assets/sounds/D#5.mp3'),
  'E5': require('../assets/sounds/E5.mp3'),
  'F5': require('../assets/sounds/F5.mp3'),
  'F#5': require('../assets/sounds/F#5.mp3'),
  'G5': require('../assets/sounds/G5.mp3'),
  'G#5': require('../assets/sounds/G#5.mp3'),
  'A5': require('../assets/sounds/A5.mp3'),
  'A#5': require('../assets/sounds/A#5.mp3'),
  'B5': require('../assets/sounds/B5.mp3'),
};

// Step 3: Restart your Expo dev server
// The playNote function is already configured to use the soundFiles map!

/**
 * WHY THIS APPROACH?
 * 
 * Metro bundler (React Native's bundler) needs to know about all assets
 * at build time. It can't resolve dynamic paths like:
 *   ❌ require(`../assets/sounds/${note}.mp3`)  // WILL NOT WORK!
 * 
 * Instead, you must use static requires:
 *   ✅ require('../assets/sounds/C4.mp3')      // WORKS!
 * 
 * The sound map approach gives you both flexibility and compatibility.
 */

/**
 * COMPLETE EXAMPLE
 * 
 * Here's what the top of your Piano.js should look like after adding sounds:
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import PianoKey from './PianoKey';

// Enable this after adding sound files
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
  'C#5': require('../assets/sounds/C#5.mp3'),
  'D5': require('../assets/sounds/D5.mp3'),
  'D#5': require('../assets/sounds/D#5.mp3'),
  'E5': require('../assets/sounds/E5.mp3'),
  'F5': require('../assets/sounds/F5.mp3'),
  'F#5': require('../assets/sounds/F#5.mp3'),
  'G5': require('../assets/sounds/G5.mp3'),
  'G#5': require('../assets/sounds/G#5.mp3'),
  'A5': require('../assets/sounds/A5.mp3'),
  'A#5': require('../assets/sounds/A#5.mp3'),
  'B5': require('../assets/sounds/B5.mp3'),
};

const Piano = () => {
  // ... rest of your component code stays the same!
  // The playNote function already checks if soundFiles exists
};

