// CarDetailsScreen.js
// 자동차 상세 화면 - 선택한 자동차의 전체 정보를 표시합니다.
// 사양, 특징, 설명, 가격 등을 포함합니다.
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

/**
 * 자동차 상세 화면 컴포넌트
 * 선택한 자동차의 상세 정보를 표시하고 예약 화면으로 이동할 수 있는 화면입니다.
 * 
 * @param {Object} route - React Navigation의 route 객체
 * @param {Object} route.params - 화면 간 전달된 파라미터
 * @param {Object} route.params.car - 표시할 자동차 데이터 객체
 * @param {Object} navigation - React Navigation의 navigation 객체
 * 
 * @returns {JSX.Element} 자동차 상세 정보와 예약 버튼이 포함된 화면
 */
const CarDetailsScreen = ({ route, navigation }) => { // 1) router, navigation 객체를 props로 받음
  // 전달된 자동차 데이터 추출
  const { car } = route.params;
  
  /**
   * 예약 화면으로 이동하는 핸들러
   * 현재 자동차 정보를 예약 화면으로 전달합니다.
   */
  const handleBookNow = () => {
    navigation.navigate('Booking', { car });   // 2) 예약 화면으로 이동하고 자동차 정보를 전달
  };

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: car.image }} style={styles.carImage} />

        <View style={styles.content}>
          {/* 자동차 기본 정보 - 이름, 모델, 종류, 등급 */}
          <View style={styles.header}>
            <View>
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carModel}>{car.model} • {car.type}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {car.rating}</Text>
            </View>
          </View>

          {/* 가격 정보 */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price per day</Text>
            <Text style={styles.price}>${car.price}</Text>
          </View>
          {/* 상세 정보 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{car.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>

            {/* 승인원 */}
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Seats:</Text>
              <Text style={styles.specValue}>{car.seats}</Text>
            </View>
            {/* 연료 종류 */}
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Fuel Type:</Text>
              <Text style={styles.specValue}>{car.fuel}</Text>
            </View>
            {/* 변속기 종류 */}
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Transmission:</Text>
              <Text style={styles.specValue}>
                {car.features.includes('Automatic') ? 'Automatic' : 'Manual'}
              </Text>
            </View>
          </View>
          {/* 특징 목록 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              {car.features.map((feature, index) => ( // 3) 자동차 특징 목록을 반복하여 표시
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureText}>✓ {feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* 예약 버튼 */}
      <View style={styles.footer}>
        <LinearGradient
          colors={['#2563eb', '#1e40af']}
          style={styles.bookButton}
        >
          {/* 4) 예약 버튼 클릭 시 handleBookNow 함수를 호출 */}
          <TouchableOpacity onPress={handleBookNow} style={styles.bookButtonTouch}>   
            <Text style={styles.bookButtonText}>Book Now</Text>
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
  // 자동차 이미지
  carImage: {
    width: '100%', // 전체 너비
    height: 300, // 고정 높이 300px
    resizeMode: 'cover', // 이미지를 영역에 맞춰 잘라서 채움
  },
  // 내용 영역
  content: {
    padding: 20, // 내부 여백
  },
  // 헤더 영역 (자동차 이름과 평점)
  header: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    alignItems: 'flex-start', // 상단 정렬
    marginBottom: 20, // 하단 여백
  },
  // 자동차 이름 텍스트
  carName: {
    fontSize: 28, // 매우 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#1e293b', // 어두운 회색 (slate-800)
    marginBottom: 5, // 하단 여백
  },
  // 자동차 모델/타입 텍스트
  carModel: {
    fontSize: 16, // 중간 글씨
    color: '#64748b', // 회색 (slate-500)
  },
  // 평점 컨테이너 (배지 형태)
  ratingContainer: {
    backgroundColor: '#fef3c7', // 연한 노란색 배경 (yellow-100)
    paddingHorizontal: 12, // 좌우 패딩
    paddingVertical: 6, // 상하 패딩
    borderRadius: 12, // 둥근 모서리
  },
  // 평점 텍스트
  rating: {
    fontSize: 16, // 중간 글씨
    fontWeight: '600', // 세미볼드
    color: '#92400e', // 갈색 (yellow-800)
  },
  // 가격 정보 컨테이너
  priceContainer: {
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
  // 가격 라벨
  priceLabel: {
    fontSize: 14, // 작은 글씨
    color: '#64748b', // 회색 (slate-500)
    marginBottom: 5, // 하단 여백
  },
  // 가격 값
  price: {
    fontSize: 32, // 매우 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#2563eb', // 파란색 (blue-600)
  },
  // 섹션 컨테이너 (설명, 사양, 특징 등)
  section: {
    marginBottom: 25, // 하단 여백
  },
  // 섹션 제목
  sectionTitle: {
    fontSize: 20, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
    color: '#1e293b', // 어두운 회색
    marginBottom: 12, // 하단 여백
  },
  // 설명 텍스트
  description: {
    fontSize: 16, // 중간 글씨
    color: '#475569', // 회색 (slate-600)
    lineHeight: 24, // 줄 간격 (가독성 향상)
  },
  // 사양 행 (라벨과 값)
  specRow: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    paddingVertical: 10, // 상하 패딩
    borderBottomWidth: 1, // 하단 테두리
    borderBottomColor: '#e2e8f0', // 연한 회색 테두리 (slate-200)
  },
  // 사양 라벨
  specLabel: {
    fontSize: 16, // 중간 글씨
    color: '#64748b', // 회색 (slate-500)
    fontWeight: '500', // 미디엄 굵기
  },
  // 사양 값
  specValue: {
    fontSize: 16, // 중간 글씨
    color: '#1e293b', // 어두운 회색
    fontWeight: '600', // 세미볼드
  },
  // 특징 그리드 컨테이너
  featuresGrid: {
    flexDirection: 'row', // 가로 방향 배치
    flexWrap: 'wrap', // 공간 부족 시 다음 줄로 넘김
  },
  // 개별 특징 아이템
  featureItem: {
    backgroundColor: '#e0e7ff', // 연한 파란색 배경 (indigo-100)
    paddingHorizontal: 15, // 좌우 패딩
    paddingVertical: 10, // 상하 패딩
    borderRadius: 10, // 둥근 모서리
    marginRight: 10, // 오른쪽 여백
    marginBottom: 10, // 하단 여백
  },
  // 특징 텍스트
  featureText: {
    fontSize: 14, // 작은 글씨
    color: '#4338ca', // 진한 파란색 (indigo-700)
    fontWeight: '500', // 미디엄 굵기
  },
  // 하단 푸터 (예약 버튼 영역)
  footer: {
    padding: 20, // 내부 여백
    paddingBottom: 30, // 하단 여백 (더 넓게)
    backgroundColor: '#fff', // 흰색 배경
    borderTopWidth: 1, // 상단 테두리
    borderTopColor: '#e2e8f0', // 연한 회색 테두리
  },
  // 예약 버튼 (LinearGradient 컨테이너)
  bookButton: {
    borderRadius: 12, // 둥근 모서리
    overflow: 'hidden', // 자식 요소가 경계를 넘지 않도록
  },
  // 예약 버튼 터치 영역
  bookButtonTouch: {
    paddingVertical: 16, // 상하 패딩
    alignItems: 'center', // 중앙 정렬
  },
  // 예약 버튼 텍스트
  bookButtonText: {
    color: '#fff', // 흰색 텍스트
    fontSize: 18, // 큰 글씨
    fontWeight: 'bold', // 굵은 글씨
  },
});

export default CarDetailsScreen;

