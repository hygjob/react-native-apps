import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CarCard from '../components/CarCard';
import { cars } from '../data/cars';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState(cars);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter(
        (car) =>
          car.name.toLowerCase().includes(text.toLowerCase()) ||
          car.type.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  };

  const handleCarPress = (car) => {
    navigation.navigate('CarDetails', { car });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563eb', '#1e40af']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Find Your Perfect Ride</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cars..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>
            {filteredCars.length} Cars Available
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('BookingsHistory')}
            style={styles.historyButton}
          >
            <Text style={styles.historyButtonText}>My Bookings</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredCars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CarCard car={item} onPress={() => handleCarPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#1e293b',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  historyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  historyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;

