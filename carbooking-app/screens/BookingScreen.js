// BookingScreen.js
// 예약 화면 - 사용자가 자동차 예약 정보(날짜, 위치, 연락처 등)를 입력하는 화면

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

/**
 * 예약 화면 컴포넌트
 * 사용자가 자동차 예약에 필요한 모든 정보를 입력하고 예약을 확정하는 화면입니다.
 * 
 * @param {Object} route - React Navigation의 route 객체
 * @param {Object} route.params - 화면 간 전달된 파라미터
 * @param {Object} route.params.car - 예약할 자동차 데이터 객체
 * @param {Object} navigation - React Navigation의 navigation 객체
 * 
 * @returns {JSX.Element} 예약 정보 입력 폼과 확인 버튼이 포함된 화면
 */
const BookingScreen = ({ route, navigation }) => { // 1) router, navigation 객체를 props로 받음
  // 선택한 자동차 데이터 추출
  const { car } = route.params;

  // 예약 정보 상태 관리
  const [pickupDate, setPickupDate] = useState(''); // 픽업 날짜
  const [returnDate, setReturnDate] = useState(''); // 반환 날짜
  const [pickupLocation, setPickupLocation] = useState(''); // 픽업 위치
  const [customerName, setCustomerName] = useState(''); // 고객 이름
  const [customerEmail, setCustomerEmail] = useState(''); // 고객 이메일
  const [customerPhone, setCustomerPhone] = useState(''); // 고객 전화번호

  /**
   * 픽업과 반환 날짜 사이의 렌탈 일수 계산
   * 두 날짜의 차이를 계산하여 렌탈 기간을 반환합니다.
   * 
   * @returns {number} 렌탈 일수 (0 이상의 정수)
   */
  const calculateDays = () => {
    if (pickupDate && returnDate) {
      const start = new Date(pickupDate); // 픽업 날짜
      const end = new Date(returnDate); // 반환 날짜
      const diffTime = Math.abs(end - start); // 밀리초 단위 차이
      // 밀리초를 일수로 변환 (1000ms * 60초 * 60분 * 24시간)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0; // 최소 0일 반환
    }
    return 0; // 날짜가 입력되지 않았으면 0 반환
  };

  /**
   * 총 렌탈 가격 계산
   * 렌탈 일수와 일일 가격을 곱하여 총 금액을 계산합니다.
   * 
   * @returns {number} 총 렌탈 가격
   */
  const calculateTotal = () => {
    const days = calculateDays();
    return days * car.price; // 일수 × 일일 가격
  };

  /**
   * 예약 확인 핸들러
   * 모든 입력 필드를 검증하고 예약 객체를 생성한 후 예약 이력 화면으로 이동합니다.
   * 
   * 검증 항목:
   * - 모든 필수 필드 입력 여부 확인
   * - 반환 날짜가 픽업 날짜보다 이후인지 확인
   */
  const handleConfirmBooking = () => {
    // 모든 필수 필드가 입력되었는지 확인
    if (!pickupDate || !returnDate || !pickupLocation || !customerName || !customerEmail || !customerPhone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // 반환 날짜가 픽업 날짜보다 뒤에 있는지 확인
    if (calculateDays() <= 0) {
      Alert.alert('Error', 'Return date must be after pickup date');
      return;
    }

    // 예약 객체 생성 - 모든 예약 정보를 포함
    const booking = {
      id: Date.now().toString(), // 타임스탬프를 사용한 고유 ID
      car: car, // 예약한 자동차 정보
      pickupDate, // 픽업 날짜
      returnDate, // 반환 날짜
      pickupLocation, // 픽업 위치
      customerName, // 고객 이름
      customerEmail, // 고객 이메일
      customerPhone, // 고객 전화번호
      totalPrice: calculateTotal(), // 계산된 총 가격
      days: calculateDays(), // 렌탈 일수
      status: 'Confirmed', // 예약 상태 (확정됨)
      bookingDate: new Date().toISOString(), // 예약 생성 시간 (ISO 형식)
    };

    // 예약 확인 알림 표시
    Alert.alert(  // 1) 예약 확정 알림 표시
      'Booking Confirmed!',
      `Your booking for ${car.name} has been confirmed. Total: $${calculateTotal()}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // 예약 이력 화면으로 이동하면서 새 예약 데이터 전달
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
          {/* 선택된 자동차 정보 표시 */}
          <View style={styles.carInfo}>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carType}>{car.type}</Text>
            <Text style={styles.pricePerDay}>${car.price} per day</Text>
          </View>

          {/* 예약 정보 입력 폼 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Details</Text>

            {/* 픽업 날짜 입력 필드 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD" // 날짜 형식 안내
                value={pickupDate} // 현재 입력된 픽업 날짜 값  // 2) 픽업 날짜 상태 관리
                onChangeText={setPickupDate} // 입력값 변경 시 상태 업데이트 // 3) 픽업 날짜 상태 업데이트
                placeholderTextColor="#94a3b8" // 플레이스홀더 텍스트 색상
              />
            </View>

            {/* 반환 날짜 입력 필드 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Return Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD" // 날짜 형식 안내
                value={returnDate} // 현재 입력된 반환 날짜 값
                onChangeText={setReturnDate} // 입력값 변경 시 상태 업데이트
                placeholderTextColor="#94a3b8" // 플레이스홀더 텍스트 색상
              />
            </View>

            {/* 픽업 위치 입력 필드 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pickup location" // 픽업 위치 입력 안내
                value={pickupLocation} // 현재 입력된 픽업 위치 값
                onChangeText={setPickupLocation} // 입력값 변경 시 상태 업데이트
                placeholderTextColor="#94a3b8" // 플레이스홀더 텍스트 색상
              />
            </View>
          </View>

          {/* 연락처 정보 입력 폼 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            {/* 고객 이름 입력 필드 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name" // 이름 입력 안내
                value={customerName} // 현재 입력된 고객 이름 값
                onChangeText={setCustomerName} // 입력값 변경 시 상태 업데이트
                placeholderTextColor="#94a3b8" // 플레이스홀더 텍스트 색상
              />
            </View>

            {/* 이메일 입력 필드 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email" // 이메일 입력 안내
                value={customerEmail} // 현재 입력된 이메일 값
                onChangeText={setCustomerEmail} // 입력값 변경 시 상태 업데이트
                keyboardType="email-address" // 이메일 키보드 타입 (@, .com 등 포함)
                autoCapitalize="none" // 자동 대문자 변환 비활성화 (이메일은 소문자)
                placeholderTextColor="#94a3b8" // 플레이스홀더 텍스트 색상
              />
            </View>

            {/* 전화번호 입력 필드 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number" // 전화번호 입력 안내
                value={customerPhone} // 현재 입력된 전화번호 값
                onChangeText={setCustomerPhone} // 입력값 변경 시 상태 업데이트
                keyboardType="phone-pad" // 숫자 키패드 타입 (전화번호 입력에 최적화)
                placeholderTextColor="#94a3b8" // 플레이스홀더 텍스트 색상
              />
            </View>
          </View>

          {/* 요약 정보 섹션 - 렌탈 일수, 가격, 총액 표시 */}
          <View style={styles.summary}>
            {/* 렌탈 일수 표시 */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rental Days:</Text>
              <Text style={styles.summaryValue}>{calculateDays()} days</Text> {/* 4) calculateDays() 함수로 계산된 일수 */}
            </View>
            {/* 일일 가격 표시 */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price per day:</Text>
              <Text style={styles.summaryValue}>${car.price}</Text> {/* 자동차의 일일 가격 */}
            </View>
            {/* 총액 표시 (구분선 포함) */}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>${calculateTotal()}</Text> {/* 5) calculateTotal() 함수로 계산된 총 가격 */}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 푸터 - 예약 확인 버튼 */}
      <View style={styles.footer}>
        {/* 그라데이션 배경의 확인 버튼 */}
        <LinearGradient
          colors={['#2563eb', '#1e40af']} // 파란색 그라데이션 (밝은 파랑 → 어두운 파랑)
          style={styles.confirmButton}
        >
          {/* 터치 가능한 확인 버튼 */}
          {/* 6) 예약 확정 버튼 클릭 시 handleConfirmBooking 함수를 호출 */}
          <TouchableOpacity onPress={handleConfirmBooking} style={styles.confirmButtonTouch}>   
            <Text style={styles.confirmButtonText}>Confirm Booking</Text> {/* 버튼 텍스트 */}
          </TouchableOpacity>
        </LinearGradient>
      </View>
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
  // 스크롤 가능한 내용 영역
  content: {
    padding: 20, // 내부 여백
  },
  // 자동차 정보 카드 스타일
  carInfo: {
    backgroundColor: '#fff', // 흰색 배경
    padding: 20, // 내부 여백
    borderRadius: 12, // 둥근 모서리
    marginBottom: 20, // 하단 여백
    // iOS 그림자 효과
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android 그림자 효과
    elevation: 3,
  },
  // 자동차 이름 텍스트
  carName: {
    fontSize: 24, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#1e293b', // 어두운 회색 (slate-800)
    marginBottom: 5, // 하단 여백
  },
  // 자동차 타입 텍스트
  carType: {
    fontSize: 16, // 중간 글씨
    color: '#64748b', // 회색 (slate-500)
    marginBottom: 10, // 하단 여백
  },
  // 일일 가격 텍스트
  pricePerDay: {
    fontSize: 20, // 큰 글씨
    fontWeight: '600', // 세미볼드
    color: '#2563eb', // 파란색 (blue-600)
  },
  // 섹션 컨테이너 (예약 정보, 연락처 정보 등)
  section: {
    backgroundColor: '#fff', // 흰색 배경
    padding: 20, // 내부 여백
    borderRadius: 12, // 둥근 모서리
    marginBottom: 20, // 하단 여백
    // iOS 그림자 효과
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android 그림자 효과
    elevation: 3,
  },
  // 섹션 제목
  sectionTitle: {
    fontSize: 20, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#1e293b', // 어두운 회색
    marginBottom: 15, // 하단 여백
  },
  // 입력 필드 그룹
  inputGroup: {
    marginBottom: 15, // 하단 여백
  },
  // 입력 필드 라벨
  label: {
    fontSize: 14, // 작은 글씨
    fontWeight: '600', // 세미볼드
    color: '#475569', // 회색 (slate-600)
    marginBottom: 8, // 하단 여백
  },
  // 텍스트 입력 필드
  input: {
    backgroundColor: '#f8fafc', // 매우 연한 회색 배경 (slate-50)
    borderWidth: 1, // 테두리 두께
    borderColor: '#e2e8f0', // 연한 회색 테두리 (slate-200)
    borderRadius: 10, // 둥근 모서리
    padding: 15, // 내부 여백
    fontSize: 16, // 중간 글씨
    color: '#1e293b', // 어두운 회색 텍스트
  },
  // 요약 정보 카드 (렌탈 일수, 가격 등)
  summary: {
    backgroundColor: '#fff', // 흰색 배경
    padding: 20, // 내부 여백
    borderRadius: 12, // 둥근 모서리
    marginBottom: 20, // 하단 여백
    // iOS 그림자 효과
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android 그림자 효과
    elevation: 3,
  },
  // 요약 행 (라벨과 값)
  summaryRow: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    marginBottom: 10, // 하단 여백
  },
  // 요약 라벨 텍스트
  summaryLabel: {
    fontSize: 16, // 중간 글씨
    color: '#64748b', // 회색 (slate-500)
  },
  // 요약 값 텍스트
  summaryValue: {
    fontSize: 16, // 중간 글씨
    fontWeight: '600', // 세미볼드
    color: '#1e293b', // 어두운 회색
  },
  // 총액 행 스타일 (구분선 포함)
  totalRow: {
    marginTop: 10, // 상단 여백
    paddingTop: 15, // 상단 패딩
    borderTopWidth: 2, // 상단 테두리 두께
    borderTopColor: '#e2e8f0', // 연한 회색 테두리
  },
  // 총액 라벨
  totalLabel: {
    fontSize: 18, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#1e293b', // 어두운 회색
  },
  // 총액 값
  totalValue: {
    fontSize: 24, // 매우 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#2563eb', // 파란색 (blue-600)
  },
  // 하단 푸터 (확인 버튼 영역)
  footer: {
    padding: 20, // 내부 여백
    paddingBottom: 30, // 하단 여백 (더 넓게)
    backgroundColor: '#fff', // 흰색 배경
    borderTopWidth: 1, // 상단 테두리
    borderTopColor: '#e2e8f0', // 연한 회색 테두리
  },
  // 확인 버튼 (LinearGradient 컨테이너)
  confirmButton: {
    borderRadius: 12, // 둥근 모서리
    overflow: 'hidden', // 자식 요소가 경계를 넘지 않도록
  },
  // 확인 버튼 터치 영역
  confirmButtonTouch: {
    paddingVertical: 16, // 상하 패딩
    alignItems: 'center', // 중앙 정렬
  },
  // 확인 버튼 텍스트
  confirmButtonText: {
    color: '#fff', // 흰색 텍스트
    fontSize: 18, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
  },
});

export default BookingScreen;

