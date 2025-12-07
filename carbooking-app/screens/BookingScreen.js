import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BookingScreen = ({ route, navigation }) => {
  const { car } = route.params;
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const calculateDays = () => {
    if (pickupDate && returnDate) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    return days * car.price;
  };

  const handleConfirmBooking = () => {
    if (!pickupDate || !returnDate || !pickupLocation || !customerName || !customerEmail || !customerPhone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (calculateDays() <= 0) {
      Alert.alert('Error', 'Return date must be after pickup date');
      return;
    }

    const booking = {
      id: Date.now().toString(),
      car: car,
      pickupDate,
      returnDate,
      pickupLocation,
      customerName,
      customerEmail,
      customerPhone,
      totalPrice: calculateTotal(),
      days: calculateDays(),
      status: 'Confirmed',
      bookingDate: new Date().toISOString(),
    };

    Alert.alert(
      'Booking Confirmed!',
      `Your booking for ${car.name} has been confirmed. Total: $${calculateTotal()}`,
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('BookingsHistory', { newBooking: booking });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.carInfo}>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carType}>{car.type}</Text>
            <Text style={styles.pricePerDay}>${car.price} per day</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={pickupDate}
                onChangeText={setPickupDate}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Return Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={returnDate}
                onChangeText={setReturnDate}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pickup location"
                value={pickupLocation}
                onChangeText={setPickupLocation}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={customerName}
                onChangeText={setCustomerName}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={customerEmail}
                onChangeText={setCustomerEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={customerPhone}
                onChangeText={setCustomerPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rental Days:</Text>
              <Text style={styles.summaryValue}>{calculateDays()} days</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price per day:</Text>
              <Text style={styles.summaryValue}>${car.price}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>${calculateTotal()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <LinearGradient
          colors={['#2563eb', '#1e40af']}
          style={styles.confirmButton}
        >
          <TouchableOpacity onPress={handleConfirmBooking} style={styles.confirmButtonTouch}>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
  content: {
    padding: 20,
  },
  carInfo: {
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
  carName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  carType: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 10,
  },
  pricePerDay: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
  },
  section: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#1e293b',
  },
  summary: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonTouch: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;

