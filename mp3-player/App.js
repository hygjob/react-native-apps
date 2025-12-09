// React Native MP3 플레이어 앱
// 필요한 라이브러리 및 컴포넌트 import
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av'; // 오디오 재생을 위한 Expo AV 라이브러리
import * as DocumentPicker from 'expo-document-picker'; // 파일 선택을 위한 Document Picker
import Slider from '@react-native-community/slider'; // 재생 위치 조절을 위한 슬라이더
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용
import { StatusBar } from 'expo-status-bar';

export default function App() {
  // 1) 상태 관리 변수들
  const [sound, setSound] = useState(null); // 현재 재생 중인 오디오 객체
  const [isPlaying, setIsPlaying] = useState(false); // 재생 중인지 여부
  const [position, setPosition] = useState(0); // 현재 재생 위치 (밀리초)
  const [duration, setDuration] = useState(0); // 전체 재생 시간 (밀리초)
  const [trackName, setTrackName] = useState('No Track Selected'); // 현재 트랙 이름
  const [isBuffering, setIsBuffering] = useState(false); // 버퍼링 중인지 여부

  // 2) 컴포넌트 마운트 시 오디오 모드 설정 및 언마운트 시 정리
  useEffect(() => {
    // 오디오 모드 설정 함수
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true, // iOS 무음 모드에서도 재생
          staysActiveInBackground: true, // 백그라운드에서도 재생 유지
          shouldDuckAndroid: true, // Android에서 다른 오디오 음소거
        });
      } catch (e) {
        console.error('Error setting audio mode', e);
      }
    };
    setupAudio();

    // 컴포넌트 언마운트 시 오디오 리소스 정리
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // 3)오디오 파일 선택 함수
  const pickAudio = async () => {
    try {
      // Document Picker를 사용하여 오디오 파일 선택
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', // 모든 오디오 파일 타입 허용
        copyToCacheDirectory: true, // 캐시 디렉토리에 복사
      });

      // 사용자가 취소한 경우 종료
      if (result.canceled) return;

      // 선택된 파일의 URI와 이름 추출
      const { uri, name } = result.assets[0];
      setTrackName(name);
      loadAudio(uri);

    } catch (error) {
      console.error('Error picking audio:', error);
    }
  };

  // 4) 선택된 오디오 파일을 로드하고 재생하는 함수
  const loadAudio = async (uri) => {
    try {
      // 기존에 재생 중인 오디오가 있으면 먼저 언로드
      if (sound) {
        await sound.unloadAsync();
      }

      // 새로운 오디오 객체 생성 및 재생 시작
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri }, // 오디오 파일 URI
        { shouldPlay: true }, // 자동 재생
        onPlaybackStatusUpdate // 재생 상태 업데이트 콜백
      );

      // 상태 업데이트
      setSound(newSound);
      setDuration(status.durationMillis);
      setPosition(0);
      setIsPlaying(true);

    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  // 5) 오디오 재생 상태가 변경될 때마다 호출되는 콜백 함수
  const onPlaybackStatusUpdate = (status) => {
    // 오디오가 성공적으로 로드된 경우
    if (status.isLoaded) {
      setPosition(status.positionMillis); // 현재 재생 위치 업데이트
      setDuration(status.durationMillis); // 전체 재생 시간 업데이트
      setIsPlaying(status.isPlaying); // 재생 상태 업데이트
      setIsBuffering(status.isBuffering); // 버퍼링 상태 업데이트
      
      // 재생이 완료된 경우
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
        // 향후 반복 재생 또는 다음 트랙 재생 기능 추가 가능
      }
    } else {
      // 오디오 로드 실패 시 에러 처리
      if (status.error) {
        console.error(`Playback Error: ${status.error}`);
      }
    }
  };

  // 6) 재생/일시정지 토글 함수
  const togglePlayback = async () => {
    // 오디오가 로드되지 않은 경우 종료
    if (!sound) return;

    // 현재 재생 중이면 일시정지, 아니면 재생
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  // 슬라이더로 재생 위치 변경 함수
  const onSliderValueChange = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value); // 재생 위치를 지정한 값으로 설정
    }
  };

  // 밀리초를 분:초 형식으로 변환하는 함수
  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = millis / 1000; // 밀리초를 초로 변환
    const minutes = Math.floor(totalSeconds / 60); // 분 계산
    const seconds = Math.floor(totalSeconds % 60); // 초 계산
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // MM:SS 형식으로 반환
  };

  // UI 렌더링
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ marginTop: 35 }} />
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MP3 Player</Text>
      </View>

      {/* 앨범 아트 영역 (현재는 아이콘으로 표시) */}
      <View style={styles.albumArtContainer}>
        <View style={styles.albumArt}>
          <Ionicons name="musical-note" size={120} color="#555" />
        </View>
      </View>

      {/* 트랙 정보 영역 */}
      <View style={styles.infoContainer}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {trackName}
        </Text>
      </View>

      {/* 컨트롤 영역 */}
      <View style={styles.controlsContainer}>
        {/* 재생 위치 슬라이더 */}
        <View style={styles.sliderContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={onSliderValueChange}
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#555"
            thumbTintColor="#1EB1FC"
            disabled={!sound}
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        {/* 버튼 컨테이너 */}
        <View style={styles.buttonsContainer}>
          {/* 파일 선택 버튼 */}
          <TouchableOpacity onPress={pickAudio} style={styles.iconButton}>
             <Ionicons name="folder-open-outline" size={30} color="#fff" />
          </TouchableOpacity>

          {/* 재생/일시정지 버튼 */}
          <TouchableOpacity 
            onPress={togglePlayback} 
            style={[styles.playButton, !sound && styles.disabledButton]}
            disabled={!sound}
          >
            {isBuffering ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color="#000" 
                style={{ marginLeft: isPlaying ? 0 : 4 }} // play 아이콘 시각적 조정
              />
            )}
          </TouchableOpacity>

          {/* 플레이리스트 버튼 (향후 기능 추가 예정) */}
          <TouchableOpacity style={styles.iconButton} disabled={true}>
            {/* 향후 플레이리스트 기능을 위한 플레이스홀더 */}
            <Ionicons name="list-outline" size={30} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  // 메인 컨테이너 스타일
  container: {
    flex: 1,
    backgroundColor: '#121212', // 다크 테마 배경색
    justifyContent: 'space-between',
  },
  // 헤더 스타일
  header: {
    paddingTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  // 앨범 아트 컨테이너 스타일
  albumArtContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 앨범 아트 스타일 (원형)
  albumArt: {
    width: 250,
    height: 250,
    backgroundColor: '#2a2a2a',
    borderRadius: 125, // 원형 만들기
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Android 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  // 트랙 정보 컨테이너 스타일
  infoContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  // 트랙 제목 스타일
  trackTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // 컨트롤 컨테이너 스타일
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  // 슬라이더 컨테이너 스타일
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  // 슬라이더 스타일
  slider: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
  // 시간 표시 텍스트 스타일
  timeText: {
    color: '#ccc',
    fontSize: 12,
    width: 45,
    textAlign: 'center',
  },
  // 버튼 컨테이너 스타일
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  // 아이콘 버튼 스타일
  iconButton: {
    padding: 10,
  },
  // 재생 버튼 스타일 (원형)
  playButton: {
    width: 70,
    height: 70,
    backgroundColor: '#1EB1FC',
    borderRadius: 35, // 원형 만들기
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 비활성화된 버튼 스타일
  disabledButton: {
    backgroundColor: '#333',
  }
});
