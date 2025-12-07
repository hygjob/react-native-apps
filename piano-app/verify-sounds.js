#!/usr/bin/env node

/**
 * Verify that all sound files exist and match expected case
 */

const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, 'assets', 'sounds');
const expectedSounds = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4',
  'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5',
  'G5', 'G#5', 'A5', 'A#5', 'B5'
];

console.log('🔍 Verifying piano sound files...\n');

if (!fs.existsSync(soundsDir)) {
  console.error('❌ Sounds directory does not exist:', soundsDir);
  process.exit(1);
}

const existingFiles = fs.readdirSync(soundsDir).filter(f => f.endsWith('.mp3'));
const fileMap = new Map(existingFiles.map(f => [f, f]));

let allGood = true;
const missing = [];
const wrongCase = [];

expectedSounds.forEach(note => {
  const expectedFile = `${note}.mp3`;
  const exactMatch = fileMap.get(expectedFile);
  
  if (!exactMatch) {
    // Check if file exists with different case
    const caseMatch = existingFiles.find(f => f.toLowerCase() === expectedFile.toLowerCase());
    
    if (caseMatch) {
      wrongCase.push({ note, expected: expectedFile, found: caseMatch });
      allGood = false;
    } else {
      missing.push(note);
      allGood = false;
    }
  }
});

if (allGood && existingFiles.length === expectedSounds.length) {
  console.log('✅ All sound files found with correct case!\n');
  console.log(`   Found ${existingFiles.length} sound files`);
  process.exit(0);
}

if (wrongCase.length > 0) {
  console.log('⚠️  CASE MISMATCH DETECTED:\n');
  wrongCase.forEach(({ note, expected, found }) => {
    console.log(`   ${note}: Expected "${expected}" but found "${found}"`);
    console.log(`   → Rename: mv "assets/sounds/${found}" "assets/sounds/${expected}"\n`);
  });
}

if (missing.length > 0) {
  console.log('❌ Missing sound files:\n');
  missing.forEach(note => {
    console.log(`   - ${note}.mp3`);
  });
  console.log('');
}

console.log('\n💡 Tips:');
console.log('   1. Check file names are EXACTLY as listed (case-sensitive)');
console.log('   2. Clear Metro cache: npx expo start -c');
console.log('   3. Restart Expo development server after renaming files\n');

process.exit(allGood ? 0 : 1);

