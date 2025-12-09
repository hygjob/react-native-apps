/**
 * Image Sharing App
 * 
 * 이 앱은 사용자가 갤러리에서 이미지를 선택하거나 카메라로 사진을 촬영하고,
 * 선택한 이미지를 다른 앱과 공유할 수 있는 React Native 앱입니다.
 */

// React와 상태 관리를 위한 useState 훅 임포트
import React, { useState } from 'react';

// React Native 핵심 컴포넌트 임포트
import {
  StyleSheet,      // 스타일시트 생성을 위한 API
  View,            // 레이아웃을 위한 컨테이너 컴포넌트
  Text,            // 텍스트 표시 컴포넌트
  Image,           // 이미지 표시 컴포넌트
  TouchableOpacity,// 터치 가능한 버튼 컴포넌트
  ScrollView,      // 스크롤 가능한 컨테이너 컴포넌트
  Alert,           // 알림 다이얼로그 API
  Platform,        // 플랫폼(iOS/Android/Web) 확인 API
} from 'react-native';

// Expo SDK 라이브러리 임포트
import { StatusBar } from 'expo-status-bar';     // 상태바 스타일 제어
import * as ImagePicker from 'expo-image-picker'; // 이미지 선택/촬영 기능
import * as Sharing from 'expo-sharing';          // 이미지 공유 기능

/**
 * App 컴포넌트 - 앱의 메인 컴포넌트
 */
export default function App() {

  // ==================== 상태 관리 ====================
  
  // 현재 선택된 이미지의 URI를 저장하는 상태
  // null이면 이미지가 선택되지 않은 상태
  const [selectedImage, setSelectedImage] = useState(null);
  
  // 사용자가 선택/촬영한 이미지들의 URI 목록 (최근 이미지가 앞에 위치)
  const [imageHistory, setImageHistory] = useState([]);

  // ==================== 권한 관리 ====================
  
  /**
   * 카메라 및 미디어 라이브러리 접근 권한을 요청하는 함수
   * @returns {Promise<boolean>} 권한이 승인되면 true, 아니면 false
   */
  const requestPermissions = async () => {
    // 웹 플랫폼이 아닌 경우에만 권한 요청 필요
    if (Platform.OS !== 'web') {
      // 카메라 권한 요청
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      // 미디어 라이브러리(갤러리) 권한 요청
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // 권한이 승인되지 않은 경우 알림 표시 후 false 반환
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Sorry, we need camera and media library permissions to make this work!'
        );
        return false;
      }
    }
    return true;
  };

  // ==================== 이미지 선택/촬영 기능 ====================

  /**
   * 갤러리(사진첩)에서 이미지를 선택하는 함수
   * 사용자가 이미지를 선택하면 selectedImage와 imageHistory를 업데이트
   */
  const pickImageFromGallery = async () => {
    // 권한 확인
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      // 갤러리 열기 및 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // 이미지만 선택 가능
        allowsEditing: true,  // 이미지 편집(크롭) 허용
        aspect: [4, 3],       // 편집 시 4:3 비율로 크롭
        quality: 1,           // 최고 품질 (0~1)
      });

      // 사용자가 취소하지 않고 이미지를 선택한 경우
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        // 선택된 이미지를 현재 이미지로 설정
        setSelectedImage(imageUri);
        // 히스토리 맨 앞에 새 이미지 추가
        setImageHistory((prev) => [imageUri, ...prev]);
      }
    } catch (error) {
      // 에러 발생 시 알림 표시
      Alert.alert('Error', 'Failed to pick image from gallery');
      console.error(error);
    }
  };

  /**
   * 카메라로 사진을 촬영하는 함수
   * 촬영된 사진은 selectedImage와 imageHistory에 저장
   */
  const takePhoto = async () => {
    // 권한 확인
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      // 카메라 앱 실행 및 사진 촬영
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,  // 촬영 후 편집(크롭) 허용
        aspect: [4, 3],       // 4:3 비율로 크롭
        quality: 1,           // 최고 품질
      });

      // 사용자가 취소하지 않고 사진을 촬영한 경우
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        // 촬영된 이미지를 현재 이미지로 설정
        setSelectedImage(imageUri);
        // 히스토리 맨 앞에 새 이미지 추가
        setImageHistory((prev) => [imageUri, ...prev]);
      }
    } catch (error) {
      // 에러 발생 시 알림 표시
      Alert.alert('Error', 'Failed to take photo');
      console.error(error);
    }
  };

  // ==================== 이미지 공유 기능 ====================

  /**
   * 현재 선택된 이미지를 다른 앱과 공유하는 함수
   * 공유 가능 여부를 먼저 확인 후 공유 다이얼로그 표시
   */
  const shareImage = async () => {
    // 선택된 이미지가 없으면 알림 표시 후 종료
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    try {
      // 현재 플랫폼에서 공유 기능 사용 가능 여부 확인
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        // 공유 다이얼로그 열기
        await Sharing.shareAsync(selectedImage, {
          mimeType: 'image/jpeg',           // 이미지 MIME 타입
          dialogTitle: 'Share this image',  // 공유 다이얼로그 제목
        });
      } else {
        // 공유 기능을 사용할 수 없는 경우 알림 표시
        Alert.alert('Sharing not available', 'Sharing is not available on this platform');
      }
    } catch (error) {
      // 에러 발생 시 알림 표시
      Alert.alert('Error', 'Failed to share image');
      console.error(error);
    }
  };

  // ==================== 유틸리티 함수 ====================

  /**
   * 히스토리에서 이미지를 선택하여 현재 이미지로 설정하는 함수
   * @param {string} imageUri - 선택할 이미지의 URI
   */
  const selectFromHistory = (imageUri) => {
    setSelectedImage(imageUri);
  };

  /**
   * 현재 선택된 이미지를 초기화(제거)하는 함수
   */
  const clearImage = () => {
    setSelectedImage(null);
  };

  // ==================== UI 렌더링 ====================
  return (
    <View style={styles.container}>
      {/* 상태바 스타일 설정 (auto: 시스템 설정에 따름) */}
      <StatusBar style="auto" />
      
      {/* ========== 헤더 영역 ========== */}
      <View style={styles.header}>
        <Text style={styles.title}>Image Sharing App</Text>
        <Text style={styles.subtitle}>Pick, view, and share your images</Text>
      </View>

      {/* ========== 메인 콘텐츠 영역 (스크롤 가능) ========== */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        {/* 조건부 렌더링: 이미지가 선택된 경우 vs 선택되지 않은 경우 */}
        {selectedImage ? (
          // ===== 이미지가 선택된 경우: 이미지 미리보기 및 액션 버튼 표시 =====
          <View style={styles.imageContainer}>
            {/* 선택된 이미지 표시 */}
            <Image source={{ uri: selectedImage }} style={styles.image} />
            
            {/* 이미지 관련 액션 버튼들 (공유, 초기화) */}
            <View style={styles.imageActions}>
              {/* 공유 버튼 */}
              <TouchableOpacity style={styles.shareButton} onPress={shareImage}>
                <Text style={styles.shareButtonText}>Share Image</Text>
              </TouchableOpacity>
              {/* 초기화(삭제) 버튼 */}
              <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // ===== 이미지가 선택되지 않은 경우: 플레이스홀더 표시 =====
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No image selected</Text>
            <Text style={styles.placeholderSubtext}>Choose an option below to get started</Text>
          </View>
        )}

        {/* ========== 이미지 히스토리 섹션 ========== */}
        {/* 히스토리에 이미지가 있을 때만 표시 */}
        {imageHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Recent Images</Text>
            {/* 가로 스크롤 가능한 히스토리 목록 */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* 히스토리 이미지들을 썸네일로 렌더링 */}
              {imageHistory.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyItem}
                  onPress={() => selectFromHistory(uri)} // 탭하면 해당 이미지 선택
                >
                  <Image source={{ uri }} style={styles.historyImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* ========== 하단 버튼 영역 ========== */}
      <View style={styles.buttonContainer}>
        {/* 갤러리에서 이미지 선택 버튼 */}
        <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
          <Text style={styles.buttonText}>📷 Choose from Gallery</Text>
        </TouchableOpacity>
        {/* 카메라로 사진 촬영 버튼 */}
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸 Take Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================== 스타일 정의 ====================
const styles = StyleSheet.create({
  
  // ===== 메인 컨테이너 =====
  container: {
    flex: 1,                    // 전체 화면 사용
    backgroundColor: '#f5f5f5', // 밝은 회색 배경
  },
  
  // ===== 헤더 스타일 =====
  header: {
    paddingTop: 60,             // 상단 여백 (상태바 고려)
    paddingBottom: 20,          // 하단 여백
    paddingHorizontal: 20,      // 좌우 여백
    backgroundColor: '#fff',    // 흰색 배경
    borderBottomWidth: 1,       // 하단 테두리
    borderBottomColor: '#e0e0e0', // 하단 테두리 색상
  },
  
  // 앱 제목 스타일
  title: {
    fontSize: 28,               // 큰 글자 크기
    fontWeight: 'bold',         // 굵은 글씨
    color: '#333',              // 진한 회색
    marginBottom: 5,            // 하단 여백
  },
  
  // 부제목 스타일
  subtitle: {
    fontSize: 14,               // 작은 글자 크기
    color: '#666',              // 중간 회색
  },
  
  // ===== 메인 콘텐츠 영역 스타일 =====
  content: {
    flex: 1,                    // 남은 공간 모두 사용
  },
  
  // ScrollView 내부 컨텐츠 컨테이너
  contentContainer: {
    padding: 20,                // 전체 패딩
  },
  
  // ===== 이미지 미리보기 컨테이너 =====
  imageContainer: {
    backgroundColor: '#fff',    // 흰색 배경
    borderRadius: 12,           // 둥근 모서리
    padding: 15,                // 내부 여백
    marginBottom: 20,           // 하단 여백
    // iOS 그림자 효과
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,               // Android 그림자 효과
  },
  
  // 선택된 이미지 스타일
  image: {
    width: '100%',              // 전체 너비
    height: 300,                // 고정 높이
    borderRadius: 8,            // 둥근 모서리
    marginBottom: 15,           // 하단 여백
    resizeMode: 'contain',      // 이미지 비율 유지하며 맞춤
    backgroundColor: '#f0f0f0', // 이미지 로딩 전 배경색
  },
  
  // 이미지 액션 버튼 컨테이너 (공유, 삭제)
  imageActions: {
    flexDirection: 'row',       // 가로 배치
    gap: 10,                    // 버튼 사이 간격
  },
  
  // ===== 공유 버튼 스타일 =====
  shareButton: {
    flex: 1,                    // 동일한 너비 (clearButton과 함께)
    backgroundColor: '#007AFF', // iOS 블루 색상
    paddingVertical: 12,        // 상하 패딩
    paddingHorizontal: 20,      // 좌우 패딩
    borderRadius: 8,            // 둥근 모서리
    alignItems: 'center',       // 텍스트 중앙 정렬
  },
  
  // 공유 버튼 텍스트
  shareButtonText: {
    color: '#fff',              // 흰색 텍스트
    fontSize: 16,               // 글자 크기
    fontWeight: '600',          // 중간 굵기
  },
  
  // ===== 초기화(삭제) 버튼 스타일 =====
  clearButton: {
    flex: 1,                    // 동일한 너비 (shareButton과 함께)
    backgroundColor: '#FF3B30', // iOS 레드 색상
    paddingVertical: 12,        // 상하 패딩
    paddingHorizontal: 20,      // 좌우 패딩
    borderRadius: 8,            // 둥근 모서리
    alignItems: 'center',       // 텍스트 중앙 정렬
  },
  
  // 초기화 버튼 텍스트
  clearButtonText: {
    color: '#fff',              // 흰색 텍스트
    fontSize: 16,               // 글자 크기
    fontWeight: '600',          // 중간 굵기
  },
  
  // ===== 플레이스홀더 (이미지 미선택 시) 스타일 =====
  placeholderContainer: {
    backgroundColor: '#fff',    // 흰색 배경
    borderRadius: 12,           // 둥근 모서리
    padding: 40,                // 넉넉한 내부 여백
    alignItems: 'center',       // 콘텐츠 중앙 정렬
    marginBottom: 20,           // 하단 여백
    // iOS 그림자 효과
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,               // Android 그림자 효과
  },
  
  // 플레이스홀더 메인 텍스트
  placeholderText: {
    fontSize: 18,               // 글자 크기
    color: '#999',              // 연한 회색
    marginBottom: 5,            // 하단 여백
  },
  
  // 플레이스홀더 서브 텍스트
  placeholderSubtext: {
    fontSize: 14,               // 작은 글자 크기
    color: '#bbb',              // 더 연한 회색
  },
  
  // ===== 이미지 히스토리 섹션 스타일 =====
  historyContainer: {
    marginTop: 10,              // 상단 여백
  },
  
  // 히스토리 제목
  historyTitle: {
    fontSize: 18,               // 글자 크기
    fontWeight: '600',          // 중간 굵기
    color: '#333',              // 진한 회색
    marginBottom: 10,           // 하단 여백
  },
  
  // 히스토리 개별 아이템 (썸네일 터치 영역)
  historyItem: {
    marginRight: 10,            // 오른쪽 여백 (아이템 간 간격)
    borderRadius: 8,            // 둥근 모서리
    overflow: 'hidden',         // 내부 이미지 모서리 자르기
    borderWidth: 2,             // 테두리 두께
    borderColor: 'transparent', // 투명 테두리 (선택 시 활성화 가능)
  },
  
  // 히스토리 썸네일 이미지
  historyImage: {
    width: 80,                  // 고정 너비
    height: 80,                 // 고정 높이 (정사각형)
    borderRadius: 6,            // 둥근 모서리
  },
  
  // ===== 하단 버튼 영역 스타일 =====
  buttonContainer: {
    padding: 20,                // 전체 패딩
    backgroundColor: '#fff',    // 흰색 배경
    borderTopWidth: 1,          // 상단 테두리
    borderTopColor: '#e0e0e0',  // 상단 테두리 색상
    gap: 12,                    // 버튼 사이 간격
  },
  
  // ===== 메인 액션 버튼 스타일 (갤러리, 카메라) =====
  button: {
    backgroundColor: '#007AFF', // iOS 블루 색상
    paddingVertical: 16,        // 상하 패딩
    paddingHorizontal: 24,      // 좌우 패딩
    borderRadius: 10,           // 둥근 모서리
    alignItems: 'center',       // 텍스트 중앙 정렬
    // iOS 그림자 효과 (버튼에 깊이감 부여)
    shadowColor: '#007AFF',     // 파란색 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,               // Android 그림자 효과
  },
  
  // 메인 버튼 텍스트
  buttonText: {
    color: '#fff',              // 흰색 텍스트
    fontSize: 18,               // 글자 크기
    fontWeight: '600',          // 중간 굵기
  },
});

