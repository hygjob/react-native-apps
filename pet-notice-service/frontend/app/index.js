// React Native 컴포넌트 불러오기
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Expo Router: 화면 이동을 위한 라우터
import { useRouter } from 'expo-router';
// 상태바 스타일 설정
import { StatusBar } from 'expo-status-bar';

/**
 * 홈 화면 컴포넌트
 * - 선생님 화면과 고객 화면 중 선택
 */
export default function HomeScreen() {
  // useRouter: 화면 이동 기능 제공
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 상태바 (시간, 배터리 표시 영역) 스타일 */}
      <StatusBar style="auto" />
      
      {/* 제목 */}
      <Text style={styles.title}>🐾 애완견 알림장 서비스</Text>
      <Text style={styles.subtitle}>반려동물의 하루를 공유하세요</Text>
      
      {/* 버튼 컨테이너 */}
      <View style={styles.buttonContainer}>
        {/* 선생님 화면 버튼 */}
        <TouchableOpacity 
          style={[styles.button, styles.teacherButton]}
          onPress={() => router.push('/teacher')}  // /teacher 화면으로 이동
        >
          <Text style={styles.buttonText}>선생님 화면</Text>
          <Text style={styles.buttonSubtext}>알림장 작성하기</Text>
        </TouchableOpacity>

        {/* 고객 화면 버튼 */}
        <TouchableOpacity 
          style={[styles.button, styles.customerButton]}
          onPress={() => router.push('/customer')}  // /customer 화면으로 이동
        >
          <Text style={styles.buttonText}>고객 화면</Text>
          <Text style={styles.buttonSubtext}>알림장 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ===== 스타일 정의 =====
// StyleSheet.create: 스타일 객체 생성 (성능 최적화)
const styles = StyleSheet.create({
  container: {
    flex: 1,  // 화면 전체 차지
    backgroundColor: '#f5f5f5',  // 밝은 회색 배경
    alignItems: 'center',  // 가로 중앙 정렬
    justifyContent: 'center',  // 세로 중앙 정렬
    padding: 20,  // 내부 여백
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,  // 버튼 사이 간격
  },
  button: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,  // 둥근 모서리
    alignItems: 'center',
    // 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,  // 그림자 효과 (Android)
  },
  teacherButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',  // 초록색 왼쪽 테두리
  },
  customerButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',  // 파란색 왼쪽 테두리
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

