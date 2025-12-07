import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const PianoKey = ({ note, isBlack, onPress, isPressed }) => {
  return (
    <TouchableOpacity
      style={[
        styles.key,
        isBlack ? styles.blackKey : styles.whiteKey,
        isPressed && (isBlack ? styles.blackKeyPressed : styles.whiteKeyPressed)
      ]}
      onPress={() => onPress(note)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.keyText,
        isBlack && styles.blackKeyText
      ]}>
        {note}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  key: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    paddingBottom: 10,
  },
  whiteKey: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 200,
    marginHorizontal: 1,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderBottomWidth: 3,
    borderBottomColor: '#E0E0E0',
  },
  blackKey: {
    backgroundColor: '#000000',
    width: 35,
    height: 130,
    position: 'absolute',
    zIndex: 2,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
  },
  whiteKeyPressed: {
    backgroundColor: '#D8E9FF',
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.15,
    borderBottomColor: '#B0C4DE',
  },
  blackKeyPressed: {
    backgroundColor: '#404040',
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.3,
  },
  keyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 0.5,
  },
  blackKeyText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});

export default PianoKey;

