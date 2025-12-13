/**
 * 고객 화면 컴포넌트
 * - 등록된 알림장 목록 표시
 * - 아래로 당겨서 새로고침 기능
 * - 알림장 클릭 시 상세 화면으로 이동
 */

// useEffect: 컴포넌트가 화면에 표시될 때 실행되는 Hook
import { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,        // 리스트 렌더링 (성능 최적화)
  Image,
  RefreshControl,  // 당겨서 새로고침
  ActivityIndicator,  // 로딩 스피너
  Alert            // 알림 대화상자
} from 'react-native';
import { useRouter } from 'expo-router';
import useNoticeStore from '../store/noticeStore';  // Zustand store

export default function CustomerScreen() {
  const router = useRouter();
  
  // Zustand store에서 상태와 함수 가져오기
  const { notices, loading, error, fetchNotices } = useNoticeStore();

  // ===== Effect Hooks =====
  
  /**
   * 컴포넌트가 처음 화면에 표시될 때 알림장 목록 가져오기
   * [] (빈 배열): 처음 한 번만 실행
   */
  useEffect(() => {
    fetchNotices();
  }, []);

  /**
   * 에러가 발생하면 알림 표시
   * [error]: error 값이 변경될 때마다 실행
   */
  useEffect(() => {
    if (error) {
      Alert.alert(
        '오류 발생', 
        `${error}\n\n확인사항:\n1. 백엔드 서버가 실행 중인가요?\n2. IP 주소(192.168.219.101)가 정확한가요?\n3. 방화벽이 3000 포트를 허용하나요?`,
        [{ text: '확인' }]
      );
    }
  }, [error]);

  /**
   * FlatList의 각 항목을 렌더링하는 함수
   * @param {object} item - 알림장 데이터
   */
  const renderNoticeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.noticeCard}
      onPress={() => router.push({
        pathname: '/notice-detail',  // 상세 화면으로 이동
        params: { id: item.id }      // 알림장 ID 전달
      })}
    >
      {/* 이미지가 있으면 표시 */}
      {item.image_url && (
        <Image 
          source={{ uri: `http://192.168.219.101:3000${item.image_url}` }}
          style={styles.thumbnail}
        />
      )}
      
      {/* 알림장 정보 */}
      <View style={styles.noticeContent}>
        <Text style={styles.noticeTitle}>{item.title}</Text>
        <Text style={styles.noticePreview} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.noticeDate}>
          {new Date(item.created_at).toLocaleDateString('ko-KR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // ===== 로딩 화면 =====
  // 처음 로딩 중이고 아직 데이터가 없을 때
  if (loading && notices.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>알림장을 불러오는 중...</Text>
        <Text style={styles.infoText}>
          백엔드 서버(192.168.219.101:3000)에 연결 중...
        </Text>
      </View>
    );
  }

  // ===== 메인 화면 =====
  return (
    <View style={styles.container}>
      {/* FlatList: 대량의 데이터를 효율적으로 렌더링 */}
      <FlatList
        data={notices}                    // 표시할 데이터 배열
        renderItem={renderNoticeItem}     // 각 항목을 렌더링하는 함수
        keyExtractor={(item) => item.id.toString()}  // 각 항목의 고유 키
        contentContainerStyle={styles.list}
        
        {/* 당겨서 새로고침 */}
        refreshControl={
          <RefreshControl 
            refreshing={loading}       // 로딩 상태
            onRefresh={fetchNotices}   // 새로고침 함수
          />
        }
        
        {/* 데이터가 없을 때 표시할 컴포넌트 */}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📭</Text>
            <Text style={styles.emptyText}>
              {error ? '서버 연결 실패' : '등록된 알림장이 없습니다'}
            </Text>
            {/* 에러가 있으면 재시도 버튼 표시 */}
            {error && (
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchNotices}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  infoText: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
  list: {
    padding: 16,
  },
  noticeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  noticeContent: {
    padding: 16,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noticePreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  noticeDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

