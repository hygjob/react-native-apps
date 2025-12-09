// CarCard.js
// 홈 화면의 자동차 목록에 표시되는 개별 자동차 카드 컴포넌트
// 자동차 이미지, 정보, 가격, 특징을 카드 형식으로 표시합니다.

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * 자동차 카드 컴포넌트
 * 
 * @param {Object} car - 자동차 데이터 객체
 * @param {string} car.image - 자동차 이미지 URL
 * @param {string} car.name - 자동차 이름
 * @param {string} car.model - 자동차 모델명
 * @param {string} car.type - 자동차 타입
 * @param {number} car.rating - 자동차 평점
 * @param {Array<string>} car.features - 자동차 특징 배열
 * @param {number} car.price - 일일 대여 가격
 * @param {Function} onPress - 카드 클릭 시 실행될 콜백 함수
 * 
 * @returns {JSX.Element} 자동차 정보를 표시하는 카드 컴포넌트
 */
const CarCard = ({ car, onPress }) => {
  return (
    // 터치 가능한 컨테이너 - 카드를 탭하면 onPress 콜백 실행
    // activeOpacity: 터치 시 투명도 (0.8 = 80% 불투명도)
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 자동차 이미지 - URL에서 이미지를 로드하여 표시 */}
      <Image source={{ uri: car.image }} style={styles.carImage} />
      
      {/* 카드 내용 영역 - 이미지 하단의 모든 정보를 포함 */}
      <View style={styles.cardContent}>

        {/* 카드 헤더 - 자동차 이름/모델과 평점을 나란히 표시 */}
        <View style={styles.cardHeader}>
          {/* 자동차 이름과 모델 정보 */}
          <View>
            <Text style={styles.carName}>{car.name}</Text>
            {/* 모델명과 타입을 구분자(•)로 연결하여 표시 */}
            <Text style={styles.carModel}>{car.model} • {car.type}</Text>
          </View>
          {/* 별점 표시 컨테이너 - 노란색 배경의 배지 형태 */}
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {car.rating}</Text>
          </View>
        </View>

        {/* 주요 기능 태그 컨테이너 - 처음 3개 기능만 표시 */}
        <View style={styles.featuresContainer}>
          {car.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* 카드 푸터 - 가격 정보와 상세 보기 버튼 */}
        <View style={styles.cardFooter}>
          {/* 가격 정보 영역 */}
          <View>
            <Text style={styles.priceLabel}>Price per day</Text>
            <Text style={styles.price}>${car.price}</Text>
          </View>
          {/* 그라데이션 배경의 상세 보기 버튼 */}
          <LinearGradient
            colors={['#2563eb', '#1e40af']} // 파란색 그라데이션 (밝은 파랑 → 어두운 파랑)
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  // 카드 전체 컨테이너 스타일
  card: {
    backgroundColor: '#fff', // 흰색 배경
    borderRadius: 16, // 둥근 모서리 (16px)
    marginBottom: 15, // 하단 여백 (카드 간 간격)
    overflow: 'hidden', // 자식 요소가 카드 경계를 넘지 않도록 설정
    // iOS 그림자 효과
    shadowColor: '#000', // 그림자 색상 (검정)
    shadowOffset: {
      width: 0, // 가로 오프셋 없음
      height: 2, // 세로 오프셋 2px (아래쪽으로 그림자)
    },
    shadowOpacity: 0.1, // 그림자 투명도 (10%)
    shadowRadius: 8, // 그림자 블러 반경 (8px)
    // Android 그림자 효과
    elevation: 4, // Android 그림자 깊이
  },
  // 자동차 이미지 스타일
  carImage: {
    width: '100%', // 카드 전체 너비
    height: 200, // 고정 높이 200px
    resizeMode: 'cover', // 이미지를 영역에 맞춰 잘라서 채움
  },
  // 카드 내용 영역 스타일
  cardContent: {
    padding: 15, // 내부 여백 15px
  },
  // 카드 헤더 스타일 (이름/모델과 평점 영역)
  cardHeader: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    alignItems: 'flex-start', // 상단 정렬
    marginBottom: 10, // 하단 여백
  },
  // 자동차 이름 텍스트 스타일
  carName: {
    fontSize: 20, // 큰 글씨 크기
    fontWeight: 'bold', // 굵은 글씨
    color: '#1e293b', // 어두운 회색 (slate-800)
    marginBottom: 4, // 하단 여백
  },
  // 자동차 모델/타입 텍스트 스타일
  carModel: {
    fontSize: 14, // 중간 글씨 크기
    color: '#64748b', // 회색 (slate-500)
  },
  // 평점 컨테이너 스타일 (배지 형태)
  ratingContainer: {
    backgroundColor: '#fef3c7', // 연한 노란색 배경 (yellow-100)
    paddingHorizontal: 10, // 좌우 패딩
    paddingVertical: 5, // 상하 패딩
    borderRadius: 12, // 둥근 모서리
  },
  // 평점 텍스트 스타일
  rating: {
    fontSize: 14, // 중간 글씨 크기
    fontWeight: '600', // 세미볼드
    color: '#92400e', // 갈색 (yellow-800)
  },
  // 기능 태그 컨테이너 스타일
  featuresContainer: {
    flexDirection: 'row', // 가로 방향 배치
    flexWrap: 'wrap', // 공간 부족 시 다음 줄로 넘김
    marginBottom: 15, // 하단 여백
    gap: 8, // 태그 간 간격
  },
  // 개별 기능 태그 스타일
  featureTag: {
    backgroundColor: '#e0e7ff', // 연한 파란색 배경 (indigo-100)
    paddingHorizontal: 10, // 좌우 패딩
    paddingVertical: 5, // 상하 패딩
    borderRadius: 8, // 둥근 모서리
    marginRight: 8, // 오른쪽 여백
    marginBottom: 5, // 하단 여백
  },
  // 기능 텍스트 스타일
  featureText: {
    fontSize: 12, // 작은 글씨 크기
    color: '#4338ca', // 진한 파란색 (indigo-700)
    fontWeight: '500', // 미디엄 굵기
  },
  // 카드 푸터 스타일 (가격과 버튼 영역)
  cardFooter: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    alignItems: 'center', // 수직 중앙 정렬
    paddingTop: 10, // 상단 패딩
    borderTopWidth: 1, // 상단 테두리 두께
    borderTopColor: '#e2e8f0', // 연한 회색 테두리 (slate-200)
  },
  // 가격 라벨 텍스트 스타일
  priceLabel: {
    fontSize: 12, // 작은 글씨 크기
    color: '#64748b', // 회색 (slate-500)
    marginBottom: 4, // 하단 여백
  },
  // 가격 텍스트 스타일
  price: {
    fontSize: 24, // 큰 글씨 크기
    fontWeight: 'bold', // 굵은 글씨
    color: '#2563eb', // 파란색 (blue-600)
  },
  // 상세 보기 버튼 스타일 (LinearGradient와 함께 사용)
  viewButton: {
    paddingHorizontal: 20, // 좌우 패딩
    paddingVertical: 10, // 상하 패딩
    borderRadius: 10, // 둥근 모서리
  },
  // 상세 보기 버튼 텍스트 스타일
  viewButtonText: {
    color: '#fff', // 흰색 텍스트
    fontWeight: '600', // 세미볼드
    fontSize: 14, // 중간 글씨 크기
  },
});

// 컴포넌트 내보내기
export default CarCard;

