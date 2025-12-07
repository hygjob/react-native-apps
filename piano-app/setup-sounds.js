#!/usr/bin/env node

/**
 * Helper script to set up piano sound files
 * 
 * This script provides instructions for downloading piano samples.
 * You can download free piano samples from:
 * - https://freesound.org
 * - https://musical-artifacts.com/
 */

console.log('🎹 Piano App - Sound Setup Helper\n');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📝 To add real piano sounds to your app:\n');

console.log('1. Download piano sound samples (MP3 format)');
console.log('   Recommended sources:');
console.log('   • Freesound.org: https://freesound.org/search/?q=piano');
console.log('   • Musical Artifacts: https://musical-artifacts.com/\n');

console.log('2. Required note names (24 files total):');
console.log('   First Octave:');
console.log('   • C4.mp3, C#4.mp3, D4.mp3, D#4.mp3, E4.mp3, F4.mp3');
console.log('   • F#4.mp3, G4.mp3, G#4.mp3, A4.mp3, A#4.mp3, B4.mp3');
console.log('   Second Octave:');
console.log('   • C5.mp3, C#5.mp3, D5.mp3, D#5.mp3, E5.mp3, F5.mp3');
console.log('   • F#5.mp3, G5.mp3, G#5.mp3, A5.mp3, A#5.mp3, B5.mp3\n');

console.log('3. Place all files in: assets/sounds/\n');

console.log('4. Update components/Piano.js:');
console.log('   Find this line near the top:');
console.log('   const soundFiles = null;');
console.log('');
console.log('   Replace it with:');
console.log(`
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
`);

console.log('   ⚠️  IMPORTANT: You MUST use static requires!');
console.log('   Metro bundler does NOT support dynamic paths like:');
console.log('   require(`../assets/sounds/${note}.mp3`) ❌');
console.log('');

console.log('\n═══════════════════════════════════════════════════════════');
console.log('\n✅ After adding sounds, restart your Expo app to hear them!\n');

