// React Hook: useState (상태 관리)
import { useState } from 'react';
// React Native 기본 컴포넌트들
import { 
  View,      // div와 유사
  Text,      // 텍스트 표시
  StyleSheet,  // 스타일 정의
  TextInput,   // 입력 필드
  TouchableOpacity,  // 터치 가능한 버튼
  Image,     // 이미지 표시
  Alert,     // 알림 대화상자
  ScrollView,  // 스크롤 가능한 뷰
  ActivityIndicator  // 로딩 스피너
} from 'react-native';
import { useRouter } from 'expo-router';  // 화면 이동
import * as ImagePicker from 'expo-image-picker';  // 이미지 선택/촬영
import useNoticeStore from '../store/noticeStore';  // Zustand 상태 관리

/**
 * 선생님 화면 컴포넌트
 * - 알림장 제목, 내용 입력
 * - 사진 촬영 또는 선택
 * - 알림장 등록
 */
export default function TeacherScreen() {
  const router = useRouter();
  
  // Zustand store에서 함수와 상태 가져오기
  const { createNotice, loading } = useNoticeStore();
  
  // ===== 컴포넌트 상태 (useState) =====
  // useState: [현재값, 값을 변경하는 함수]
  const [title, setTitle] = useState('');  // 제목
  const [content, setContent] = useState('');  // 내용
  const [image, setImage] = useState(null);  // 이미지 URI

  // ===== 이미지 선택 함수 =====
  /**
   * 갤러리에서 이미지 선택
   */
  const pickImage = async () => {
    // 1. 갤러리 접근 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 선택하려면 권한이 필요합니다.');
      return;
    }

    // 2. 이미지 선택 화면 표시
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // 이미지만
      allowsEditing: true,  // 편집 가능
      aspect: [4, 3],  // 가로:세로 비율
      quality: 0.8,  // 화질 (0~1)
    });

    // 3. 선택한 이미지 저장
    if (!result.canceled) {
      setImage(result.assets[0].uri);  // 이미지 URI 저장
    }
  };

  /**
   * 카메라로 사진 촬영
   */
  const takePhoto = async () => {
    // 1. 카메라 접근 권한 요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라를 사용하려면 권한이 필요합니다.');
      return;
    }

    // 2. 카메라 실행
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    // 3. 촬영한 사진 저장
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ===== 알림장 제출 함수 =====
  /**
   * 입력값을 검증하고 백엔드 API로 전송
   */
  const handleSubmit = async () => {
    // 1. 입력값 검증
    if (!title.trim() || !content.trim()) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 2. API 호출 (Zustand store의 createNotice 함수)
    const result = await createNotice(title, content, image);
    
    // 3. 결과 처리
    if (result.success) {
      Alert.alert('성공', '알림장이 등록되었습니다!', [
        { text: 'OK', onPress: () => {
          // 입력 필드 초기화
          setTitle('');
          setContent('');
          setImage(null);
          // 고객 화면으로 이동
          router.push('/customer');
        }}
      ]);
    } else {
      Alert.alert('오류', result.error || '알림장 등록에 실패했습니다.');
    }
  };

  // ===== UI 렌더링 =====
  return (
    // ScrollView: 내용이 화면을 넘어갈 때 스크롤 가능
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* 제목 입력 */}
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          placeholder="알림장 제목을 입력하세요"
          value={title}
          onChangeText={setTitle}  // 텍스트 변경 시 호출
        />

        {/* 내용 입력 */}
        <Text style={styles.label}>내용</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="오늘의 활동 내용을 입력하세요"
          value={content}
          onChangeText={setContent}
          multiline  // 여러 줄 입력 가능
          numberOfLines={6}  // 기본 6줄 표시
        />

        {/* 이미지 미리보기 */}
        <Text style={styles.label}>사진</Text>
        <View style={styles.imageContainer}>
          {image ? (
            // 이미지가 있을 때
            <View>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setImage(null)}  // 이미지 제거
              >
                <Text style={styles.removeImageText}>사진 제거</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // 이미지가 없을 때
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>사진이 없습니다</Text>
            </View>
          )}
        </View>

        {/* 이미지 선택 버튼들 */}
        <View style={styles.imageButtonContainer}>
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={pickImage}  // 갤러리에서 선택
          >
            <Text style={styles.imageButtonText}>📷 갤러리에서 선택</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={takePhoto}  // 카메라로 촬영
          >
            <Text style={styles.imageButtonText}>📸 카메라로 촬영</Text>
          </TouchableOpacity>
        </View>

        {/* 제출 버튼 */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}  // 로딩 중에는 비활성화
        >
          {loading ? (
            <ActivityIndicator color="#fff" />  // 로딩 스피너
          ) : (
            <Text style={styles.submitButtonText}>알림장 등록하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 14,
  },
  removeImageButton: {
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

