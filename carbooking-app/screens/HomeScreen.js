// HomeScreen.js
// 홈 화면 - 자동차 목록을 표시하고 검색 기능을 제공하는 메인 화면

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

/**
 * 홈 화면 컴포넌트
 * 자동차 목록을 표시하고 검색 기능을 제공하는 메인 화면입니다.
 * 사용자는 자동차를 검색하고, 목록에서 선택하여 상세 정보를 볼 수 있습니다.
 * 
 * @param {Object} navigation - React Navigation의 navigation 객체
 * 
 * @returns {JSX.Element} 자동차 목록과 검색 기능이 포함된 홈 화면
 */
const HomeScreen = ({ navigation }) => {                    // 1)
  // 검색 입력 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  // 필터링된 자동차 목록 상태 관리
  const [filteredCars, setFilteredCars] = useState(cars);

  /**
   * 검색 기능 핸들러
   * 사용자가 입력한 검색어로 자동차 목록을 필터링합니다.
   * 자동차 이름 또는 타입에 검색어가 포함된 항목만 표시합니다.
   * 
   * @param {string} text - 검색어
   */
  const handleSearch = (text) => {
    setSearchQuery(text); // 검색어 상태 업데이트
    
    // 검색어가 비어있으면 전체 리스트 표시
    if (text.trim() === '') {
      setFilteredCars(cars);
    } else {
      // 자동차 이름이나 종류에 검색어가 포함되면 필터링
      // 대소문자 구분 없이 검색
      const filtered = cars.filter(
        (car) =>
          car.name.toLowerCase().includes(text.toLowerCase()) ||
          car.type.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  };

  /**
   * 자동차 카드 클릭 핸들러
   * 선택한 자동차의 상세 정보 화면으로 이동합니다.
   * 
   * @param {Object} car - 선택한 자동차 데이터 객체
   */
  const handleCarPress = (car) => {
    navigation.navigate('CarDetails', { car });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 섹션 - 제목과 검색창 포함 */}
      <LinearGradient
        colors={['#2563eb', '#1e40af']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Find Your Perfect Ride</Text>
        {/* 검색 입력창 */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search cars..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </LinearGradient>

      <View style={styles.content}>
        {/* 액션 섹션 - 사용 가능한 자동차 수와 예약 이력 버튼 */}
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>
            {filteredCars.length} Cars Available
          </Text>
          {/* 예약 이력 화면으로 이동하는 버튼 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('BookingsHistory')}
            style={styles.historyButton}
          >
            <Text style={styles.historyButtonText}>My Bookings</Text>
          </TouchableOpacity>
        </View>

        {/* 자동차 목록 - FlatList를 사용하여 효율적으로 렌더링 */}
        <FlatList
          data={filteredCars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CarCard car={item} onPress={() => handleCarPress(item)} />     // 2) onPress 속성을 통해 handleCarPress 함수를 호출
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    marginBottom: 15, // 하단 여백
  },
  // 검색 입력창
  searchInput: {
    backgroundColor: '#fff', // 흰색 배경
    borderRadius: 12, // 둥근 모서리
    padding: 15, // 내부 여백
    fontSize: 16, // 중간 글씨
    color: '#1e293b', // 어두운 회색 텍스트
  },
  // 내용 영역
  content: {
    flex: 1, // 남은 공간 모두 차지
    padding: 15, // 내부 여백
  },
  // 헤더 액션 영역 (자동차 개수와 예약 이력 버튼)
  headerActions: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝에 배치
    alignItems: 'center', // 수직 중앙 정렬
    marginBottom: 15, // 하단 여백
  },
  // 섹션 제목 (자동차 개수)
  sectionTitle: {
    fontSize: 18, // 큰 글씨
    fontWeight: '600', // 세미볼드
    color: '#1e293b', // 어두운 회색
  },
  // 예약 이력 버튼
  historyButton: {
    backgroundColor: '#2563eb', // 파란색 배경
    paddingHorizontal: 15, // 좌우 패딩
    paddingVertical: 8, // 상하 패딩
    borderRadius: 8, // 둥근 모서리
  },
  // 예약 이력 버튼 텍스트
  historyButtonText: {
    color: '#fff', // 흰색 텍스트
    fontWeight: '600', // 세미볼드
    fontSize: 14, // 작은 글씨
  },
  // 리스트 내용 영역
  listContent: {
    paddingBottom: 20, // 하단 여백
  },
});

export default HomeScreen;

