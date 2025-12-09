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

/**
 * 예약 이력 화면 컴포넌트
 * 사용자가 예약한 모든 자동차 예약 내역을 목록으로 표시합니다.
 * 새로운 예약이 추가되면 자동으로 목록에 반영됩니다.
 * 
 * @param {Object} route - React Navigation의 route 객체
 * @param {Object} route.params - 화면 간 전달된 파라미터
 * @param {Object} route.params.newBooking - 새로 추가된 예약 데이터 (선택사항)
 * @param {Object} navigation - React Navigation의 navigation 객체
 * 
 * @returns {JSX.Element} 예약 목록 또는 빈 상태 메시지를 표시하는 화면
 */
const BookingsHistoryScreen = ({ route, navigation }) => {
  // 예약 목록 상태 관리
  const [bookings, setBookings] = useState([]);
  // 1) 새로운 예약이 추가될 때마다 업데이트
  useEffect(() => {
    if (route.params?.newBooking) {
      setBookings((prev) => [route.params.newBooking, ...prev]);
    }
  }, [route.params?.newBooking]);

  /**
   * 날짜 포맷 함수
   * ISO 형식의 날짜 문자열을 읽기 쉬운 형식으로 변환합니다.
   * 예: "2024-01-15" → "Jan 15, 2024"
   * 
   * @param {string} dateString - ISO 형식의 날짜 문자열
   * @returns {string} 포맷된 날짜 문자열
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', // 연도 (예: 2024)
      month: 'short', // 짧은 월 이름 (예: Jan)
      day: 'numeric', // 일 (예: 15)
    });
  };

  /**
   * 개별 예약 항목 렌더링 함수
   * FlatList에서 각 예약 항목을 렌더링할 때 사용됩니다.
   * 
   * @param {Object} item - 예약 데이터 객체
   * @returns {JSX.Element} 예약 카드 컴포넌트
   */
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
            // 2) 자동차 상세 화면으로 이동하고 자동차 정보를 전달
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
      {bookings.length === 0 ? ( // 3) 예약이 없을 경우 빈 상태 표시
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
        // 4) 예약이 있을 경우 예약 목록 표시
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem} // 5) 예약 목록 렌더링
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  // 화면 전체 컨테이너
  container: {
    flex: 1, // 전체 화면 차지
    backgroundColor: '#f1f5f9', // 연한 회색 배경 (slate-100)
  },
  // 헤더 섹션 (그라데이션 배경)
  header: {
    padding: 20, // 내부 여백
    paddingTop: 40, // 상단 여백 (상태바 고려)
    paddingBottom: 30, // 하단 여백
  },
  // 헤더 제목
  headerTitle: {
    fontSize: 28, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#fff', // 흰색 텍스트
    marginBottom: 5, // 하단 여백
  },
  // 헤더 부제목 (예약 개수)
  headerSubtitle: {
    fontSize: 16, // 중간 글씨
    color: '#cbd5e1', // 연한 회색 (slate-300)
  },
  // 리스트 내용 영역
  listContent: {
    padding: 15, // 내부 여백
  },
  // 예약 카드 컨테이너
  bookingCard: {
    backgroundColor: '#fff', // 흰색 배경
    borderRadius: 16, // 둥근 모서리
    padding: 20, // 내부 여백
    marginBottom: 15, // 하단 여백
    // iOS 그림자 효과
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android 그림자 효과
    elevation: 4,
  },
  // 예약 헤더 (자동차 정보와 상태 배지)
  bookingHeader: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    alignItems: 'flex-start', // 상단 정렬
    marginBottom: 15, // 하단 여백
  },
  // 자동차 이름 텍스트
  carName: {
    fontSize: 20, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#1e293b', // 어두운 회색 (slate-800)
    marginBottom: 5, // 하단 여백
  },
  // 자동차 타입 텍스트
  carType: {
    fontSize: 14, // 작은 글씨
    color: '#64748b', // 회색 (slate-500)
  },
  // 상태 배지 기본 스타일
  statusBadge: {
    backgroundColor: '#fef3c7', // 연한 노란색 배경 (yellow-100)
    paddingHorizontal: 12, // 좌우 패딩
    paddingVertical: 6, // 상하 패딩
    borderRadius: 12, // 둥근 모서리
  },
  // 확인된 상태 배지 스타일
  statusConfirmed: {
    backgroundColor: '#d1fae5', // 연한 초록색 배경 (green-100)
  },
  // 상태 텍스트
  statusText: {
    fontSize: 12, // 작은 글씨
    fontWeight: '600', // 세미볼드
    color: '#065f46', // 진한 초록색 (green-800)
  },
  // 예약 상세 정보 영역
  bookingDetails: {
    marginBottom: 15, // 하단 여백
    paddingTop: 15, // 상단 패딩
    borderTopWidth: 1, // 상단 테두리
    borderTopColor: '#e2e8f0', // 연한 회색 테두리 (slate-200)
  },
  // 상세 정보 행 (라벨과 값)
  detailRow: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    marginBottom: 8, // 하단 여백
  },
  // 상세 정보 라벨
  detailLabel: {
    fontSize: 14, // 작은 글씨
    color: '#64748b', // 회색 (slate-500)
  },
  // 상세 정보 값
  detailValue: {
    fontSize: 14, // 작은 글씨
    fontWeight: '600', // 세미볼드
    color: '#1e293b', // 어두운 회색
  },
  // 예약 푸터 (가격과 버튼)
  bookingFooter: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    alignItems: 'center', // 수직 중앙 정렬
    paddingTop: 15, // 상단 패딩
    borderTopWidth: 1, // 상단 테두리
    borderTopColor: '#e2e8f0', // 연한 회색 테두리
  },
  // 총액 라벨
  totalLabel: {
    fontSize: 12, // 작은 글씨
    color: '#64748b', // 회색
    marginBottom: 4, // 하단 여백
  },
  // 총액 값
  totalValue: {
    fontSize: 22, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#2563eb', // 파란색 (blue-600)
  },
  // 자동차 보기 버튼
  viewButton: {
    backgroundColor: '#2563eb', // 파란색 배경
    paddingHorizontal: 20, // 좌우 패딩
    paddingVertical: 10, // 상하 패딩
    borderRadius: 10, // 둥근 모서리
  },
  // 자동차 보기 버튼 텍스트
  viewButtonText: {
    color: '#fff', // 흰색 텍스트
    fontWeight: '600', // 세미볼드
    fontSize: 14, // 작은 글씨
  },
  // 빈 상태 컨테이너 (예약이 없을 때)
  emptyContainer: {
    flex: 1, // 전체 공간 차지
    justifyContent: 'center', // 수직 중앙 정렬
    alignItems: 'center', // 수평 중앙 정렬
    padding: 40, // 내부 여백
  },
  // 빈 상태 아이콘 (이모지)
  emptyIcon: {
    fontSize: 80, // 매우 큰 글씨 (이모지 크기)
    marginBottom: 20, // 하단 여백
  },
  // 빈 상태 제목
  emptyTitle: {
    fontSize: 24, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#1e293b', // 어두운 회색
    marginBottom: 10, // 하단 여백
  },
  // 빈 상태 설명 텍스트
  emptyText: {
    fontSize: 16, // 중간 글씨
    color: '#64748b', // 회색
    textAlign: 'center', // 중앙 정렬
    marginBottom: 30, // 하단 여백
  },
  // 자동차 둘러보기 버튼
  browseButton: {
    backgroundColor: '#2563eb', // 파란색 배경
    paddingHorizontal: 30, // 좌우 패딩
    paddingVertical: 15, // 상하 패딩
    borderRadius: 12, // 둥근 모서리
  },
  // 자동차 둘러보기 버튼 텍스트
  browseButtonText: {
    color: '#fff', // 흰색 텍스트
    fontSize: 16, // 중간 글씨
    fontWeight: '600', // 세미볼드
  },
});

export default BookingsHistoryScreen;

