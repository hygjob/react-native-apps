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

// 자동차 카드 컴포넌트
// Props: car(자동차 데이터), onPress(카드 클릭 이벤트)
const CarCard = ({ car, onPress }) => {
  return (
    // 터치 가능한 컨테이너 - 카드를 탭하면 onPress 콜백 실행
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 자동차 이미지 */}
      <Image source={{ uri: car.image }} style={styles.carImage} />
      <View style={styles.cardContent}>

        <View style={styles.cardHeader}>
          {/* 자동차 이름과 등급 */}
          <View>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carModel}>{car.model} • {car.type}</Text>
          </View>
          {/* 별점 */}
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {car.rating}</Text>
          </View>
        </View>

        {/* 주요 기능 태그 (처음 3개만 표시) */}
        <View style={styles.featuresContainer}>
          {car.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* 가격 및 상세 보기 버튼 */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceLabel}>Price per day</Text>
            <Text style={styles.price}>${car.price}</Text>
          </View>
          <LinearGradient
            colors={['#2563eb', '#1e40af']}
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  carImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  carModel: {
    fontSize: 14,
    color: '#64748b',
  },
  ratingContainer: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 12,
    color: '#4338ca',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  viewButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CarCard;

