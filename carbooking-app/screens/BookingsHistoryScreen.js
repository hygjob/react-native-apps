// BookingsHistoryScreen.js
// 예약 이력 화면 - 사용자의 모든 자동차 예약 내역을 표시합니다.
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BookingsHistoryScreen = ({ route, navigation }) => {
  // 예약 목록 상태 관리
  const [bookings, setBookings] = useState([]);
  // 새로운 예약이 추가될 때마다 업데이트
  useEffect(() => {
    if (route.params?.newBooking) {
      setBookings((prev) => [route.params.newBooking, ...prev]);
    }
  }, [route.params?.newBooking]);

  // 날짜 포맷 함수 - ISO 문자열을 읽기 쉬운 형식으로 변환
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 개별 예약 항목 렌더링 함수
  const renderBookingItem = ({ item }) => {
    return (
      <View style={styles.bookingCard}>
        {/* 예약 헤더 - 자동차 정보 */}
        <View style={styles.bookingHeader}>
          <View>
            <Text style={styles.carName}>{item.car.name}</Text>
            <Text style={styles.carType}>{item.car.type}</Text>
          </View>
          {/* 예약 상태 배지 */}
          <View
            style={[
              styles.statusBadge,
              item.status === 'Confirmed' && styles.statusConfirmed,
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        {/* 예약 상세 정보 */}
        <View style={styles.bookingDetails}>
          {/* 픽업 날짜 */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pickup:</Text>
            <Text style={styles.detailValue}>{formatDate(item.pickupDate)}</Text>
          </View>
          {/* 반환 날짜 */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Return:</Text>
            <Text style={styles.detailValue}>{formatDate(item.returnDate)}</Text>
          </View>
          {/* 픽업 위치 */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{item.pickupLocation}</Text>
          </View>
          {/* 렌탈 기간 */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{item.days} days</Text>
          </View>
        </View>

        {/* 예약 금액 및 자동차 상세보기 버튼 */}
        <View style={styles.bookingFooter}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${item.totalPrice}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('CarDetails', { car: item.car })}
          >
            <Text style={styles.viewButtonText}>View Car</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 섹션 */}
      <LinearGradient
        colors={['#2563eb', '#1e40af']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
        </Text>
      </LinearGradient>

      {/* 예약이 없을 경우 빈 상태 표시 */}
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyTitle}>No Bookings Yet</Text>
          <Text style={styles.emptyText}>
            Start booking your favorite cars to see them here!
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Cars</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  listContent: {
    padding: 15,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  carType: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065f46',
  },
  bookingDetails: {
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  viewButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingsHistoryScreen;

