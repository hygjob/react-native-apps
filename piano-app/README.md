# 🎹 Piano App

A beautiful and interactive piano application built with React Native, Expo SDK 54, and JavaScript.

## Features

- ✨ Interactive 2-octave piano keyboard (C4 - B5, 24 keys)
- 🎨 Beautiful UI with realistic white and black keys
- 📱 Responsive touch interface
- 🔄 Horizontal scrolling for full keyboard view
- 💫 Visual feedback when keys are pressed
- 📳 Haptic feedback for better user experience
- 🎵 Ready for real piano sound samples

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

### Running on Specific Platforms

```bash
# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Adding Real Piano Sounds

To add authentic piano sounds to the app:

1. Download piano sound samples in MP3 format (one file per note)
2. Name them according to the note (e.g., `C4.mp3`, `C#4.mp3`, `D4.mp3`, etc.)
3. Place them in the `assets/sounds/` directory
4. Update the `playNote` function in `components/Piano.js` to load the sound files:

```javascript
const { sound } = await Audio.Sound.createAsync(
  require(`../assets/sounds/${note}.mp3`),
  { shouldPlay: true, volume: 0.8 }
);
```

### Where to Find Piano Samples

- [Freesound.org](https://freesound.org) - Free sound samples
- [Musical Artifacts](https://musical-artifacts.com/) - Free music software and samples
- Create your own using a MIDI keyboard and recording software

## Project Structure

```
piano-app/
├── components/
│   ├── Piano.js          # Main piano keyboard component
│   └── PianoKey.js       # Individual piano key component
├── assets/
│   └── sounds/           # Piano sound samples (add your own)
├── utils/
│   └── soundManager.js   # Sound management utility
├── App.js                # Main app entry point
└── package.json          # Project dependencies
```

## Technologies Used

- **React Native** - Mobile app framework
- **Expo SDK 54** - Development platform
- **expo-av** - Audio playback
- **expo-haptics** - Haptic feedback
- **JavaScript** - Programming language

## Customization

### Changing the Number of Octaves

Edit the `keys` array in `components/Piano.js` to add or remove octaves.

### Styling

Modify the `StyleSheet` objects in:
- `components/Piano.js` - Overall layout and colors
- `components/PianoKey.js` - Individual key appearance

### Key Dimensions

Adjust key sizes in `components/PianoKey.js`:
- `whiteKey`: width, height
- `blackKey`: width, height

## Known Limitations

- Currently uses visual and haptic feedback only (no audio by default)
- Real piano samples need to be added manually
- Optimized for portrait and landscape orientations

## Future Enhancements

- [ ] Include built-in piano sound samples
- [ ] Record and playback functionality
- [ ] Multiple instrument sounds (organ, synth, etc.)
- [ ] Visual note names toggle
- [ ] Adjustable key sensitivity
- [ ] MIDI support
- [ ] Song tutorials and learning mode

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Acknowledgments

Built with ❤️ using React Native and Expo

mp3 file from https://ggonggi.tistory.com/entry/%ED%94%BC%EC%95%84%EB%85%B8-%EC%9D%8C%EA%B3%84-%EC%86%8C%EB%A6%AC-mp3-%EB%AC%B4%EB%A3%8C-%EB%8F%84%EB%A0%88%EB%AF%B8%ED%8C%8C%EC%86%94%EB%9D%BC%EC%8B%9C%EB%8F%84-%EC%82%AC%EC%9A%B4%EB%93%9C