import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CarDetailsScreen = ({ route, navigation }) => {
  const { car } = route.params;

  const handleBookNow = () => {
    navigation.navigate('Booking', { car });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: car.image }} style={styles.carImage} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carModel}>{car.model} • {car.type}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {car.rating}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price per day</Text>
            <Text style={styles.price}>${car.price}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{car.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Seats:</Text>
              <Text style={styles.specValue}>{car.seats}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Fuel Type:</Text>
              <Text style={styles.specValue}>{car.fuel}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Transmission:</Text>
              <Text style={styles.specValue}>
                {car.features.includes('Automatic') ? 'Automatic' : 'Manual'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              {car.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureText}>✓ {feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <LinearGradient
          colors={['#2563eb', '#1e40af']}
          style={styles.bookButton}
        >
          <TouchableOpacity onPress={handleBookNow} style={styles.bookButtonTouch}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  carImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  carName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  carModel: {
    fontSize: 16,
    color: '#64748b',
  },
  ratingContainer: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
  },
  priceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  specLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#4338ca',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonTouch: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CarDetailsScreen;

