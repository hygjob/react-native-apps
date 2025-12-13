import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const API_URL = 'http://192.168.219.101:3000/api';

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      const response = await fetch(`${API_URL}/notices/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setNotice(data.notice);
      }
    } catch (error) {
      console.error('알림장 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!notice) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>알림장을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {notice.image_url && (
        <Image 
          source={{ uri: `http://localhost:3000${notice.image_url}` }}
          style={styles.image}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.date}>
          {new Date(notice.created_at).toLocaleString('ko-KR')}
        </Text>
        <Text style={styles.body}>{notice.content}</Text>
      </View>
    </ScrollView>
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
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

