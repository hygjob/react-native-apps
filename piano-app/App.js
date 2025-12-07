import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Piano from './components/Piano';

export default function App() {
  return (
    <View style={styles.container}>
      <Piano />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
