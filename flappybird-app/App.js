import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 게임 설정
const GRAVITY = 0.6;
const JUMP_VELOCITY = -8;
const BIRD_SIZE = 40;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPACING = 220;
const GROUND_HEIGHT = 100;

export default function App() {
  // 게임 상태
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  // 새의 위치와 속도
  const [birdY, setBirdY] = useState(SCREEN_HEIGHT / 2 - BIRD_SIZE / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  
  // 파이프 상태
  const [pipes, setPipes] = useState([
    { x: SCREEN_WIDTH + 100, topHeight: 150, passed: false },
    { x: SCREEN_WIDTH + 100 + PIPE_SPACING, topHeight: 250, passed: false },
    { x: SCREEN_WIDTH + 100 + PIPE_SPACING * 2, topHeight: 100, passed: false },
  ]);

  const gameLoop = useRef(null);
  const birdRotation = useRef(new Animated.Value(0)).current;

  // 게임 루프
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop.current = setInterval(() => {
        // 새의 물리 업데이트
        setBirdVelocity((v) => v + GRAVITY);
        setBirdY((y) => {
          const newY = y + birdVelocity;
          
          // 땅이나 천장 충돌 검사
          if (newY > SCREEN_HEIGHT - GROUND_HEIGHT - BIRD_SIZE || newY < 0) {
            setGameOver(true);
            return y;
          }
          return newY;
        });

        // 새의 회전 애니메이션
        Animated.timing(birdRotation, {
          toValue: Math.min(Math.max(birdVelocity * 3, -30), 90),
          duration: 100,
          useNativeDriver: true,
        }).start();

        // 파이프 이동 및 충돌 검사
        setPipes((currentPipes) => {
          return currentPipes.map((pipe, index) => {
            const newX = pipe.x - 3;
            
            // 파이프가 화면 왼쪽을 벗어나면 재생성
            if (newX < -PIPE_WIDTH) {
              // 가장 오른쪽에 있는 파이프 찾기
              const rightmostX = Math.max(...currentPipes.map(p => p.x));
              
              // 랜덤 간격 생성 (1칸 ~ 1.5칸)
              const randomSpacing = PIPE_SPACING + Math.random() * (PIPE_SPACING * 0.5);
              
              // 이전 파이프의 높이를 참조 (부드러운 난이도)
              const prevPipe = currentPipes[(index - 1 + currentPipes.length) % currentPipes.length];
              const minHeight = 100;
              const maxHeight = SCREEN_HEIGHT - PIPE_GAP - GROUND_HEIGHT - 100;
              
              // 이전 파이프 기준으로 ±100 범위 내에서 변화
              const heightChange = (Math.random() - 0.5) * 200;
              let newHeight = prevPipe.topHeight + heightChange;
              
              // 최소/최대 범위 제한
              newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
              
              return {
                x: rightmostX + randomSpacing,  // 랜덤 간격 적용
                topHeight: newHeight,
                passed: false,
              };
            }

            // 점수 계산
            if (!pipe.passed && newX + PIPE_WIDTH < SCREEN_WIDTH / 2 - BIRD_SIZE / 2) {
              setScore((s) => s + 1);
              return { ...pipe, x: newX, passed: true };
            }

            // 충돌 검사
            const birdLeft = SCREEN_WIDTH / 2 - BIRD_SIZE / 2;
            const birdRight = SCREEN_WIDTH / 2 + BIRD_SIZE / 2;
            const birdTop = birdY;
            const birdBottom = birdY + BIRD_SIZE;

            const pipeLeft = newX;
            const pipeRight = newX + PIPE_WIDTH;
            const topPipeBottom = pipe.topHeight;
            const bottomPipeTop = pipe.topHeight + PIPE_GAP;

            // 새와 파이프가 겹치는지 확인
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
              if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
                setGameOver(true);
              }
            }

            return { ...pipe, x: newX };
          });
        });
      }, 1000 / 60); // 60 FPS

      return () => clearInterval(gameLoop.current);
    }
  }, [gameStarted, gameOver, birdVelocity, birdY]);

  // 새 점프
  const jump = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!gameOver) {
      setBirdVelocity(JUMP_VELOCITY);
    }
  };

  // 게임 재시작
  const restart = () => {
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setBirdY(SCREEN_HEIGHT / 2 - BIRD_SIZE / 2);
    setBirdVelocity(0);
    setPipes([
      { x: SCREEN_WIDTH + 100, topHeight: 150, passed: false },
      { x: SCREEN_WIDTH + 100 + PIPE_SPACING, topHeight: 250, passed: false },
      { x: SCREEN_WIDTH + 100 + PIPE_SPACING * 2, topHeight: 100, passed: false },
    ]);
    birdRotation.setValue(0);
  };

  const rotation = birdRotation.interpolate({
    inputRange: [-30, 90],
    outputRange: ['-30deg', '90deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* 배경 */}
      <View style={styles.background}>
        {/* 점수 */}
        {gameStarted && (
          <Text style={styles.score}>{score}</Text>
        )}

        {/* 새 */}
        <Animated.View
          style={[
            styles.bird,
            {
              top: birdY,
              left: SCREEN_WIDTH / 2 - BIRD_SIZE / 2,
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          {/* 몸통 */}
          <View style={styles.birdBody} />
          
          {/* 눈 */}
          <View style={styles.birdEye}>
            <View style={styles.birdPupil} />
          </View>
          
          {/* 부리 */}
          <View style={styles.birdBeak} />
          
          {/* 날개 */}
          <View style={styles.birdWing} />
        </Animated.View>

        {/* 파이프들 */}
        {pipes.map((pipe, index) => (
          <View key={index}>
            {/* 위쪽 파이프 */}
            <View
              style={[
                styles.pipe,
                styles.pipeTop,
                {
                  left: pipe.x,
                  height: pipe.topHeight,
                },
              ]}
            />
            {/* 아래쪽 파이프 */}
            <View
              style={[
                styles.pipe,
                styles.pipeBottom,
                {
                  left: pipe.x,
                  top: pipe.topHeight + PIPE_GAP,
                  height: SCREEN_HEIGHT - pipe.topHeight - PIPE_GAP - GROUND_HEIGHT,
                },
              ]}
            />
          </View>
        ))}

        {/* 땅 */}
        <View style={styles.ground} />

        {/* 시작 화면 */}
        {!gameStarted && !gameOver && (
          <View style={styles.startScreen} pointerEvents="none">
            <Text style={styles.title}>Flappy Bird</Text>
            <Text style={styles.subtitle}>화면을 탭해서 시작하세요</Text>
          </View>
        )}

        {/* 게임 오버 화면 */}
        {gameOver && (
          <View style={styles.gameOverScreen} pointerEvents="box-none">
            <Text style={styles.gameOverText}>Game Over!</Text>
            <Text style={styles.finalScore}>점수: {score}</Text>
            <TouchableOpacity style={styles.restartButton} onPress={restart}>
              <Text style={styles.restartButtonText}>다시 시작</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 탭 영역 */}
        <TouchableOpacity
          style={styles.tapArea}
          onPress={jump}
          activeOpacity={1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70c5ce',
  },
  background: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#70c5ce',
  },
  bird: {
    position: 'absolute',
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    zIndex: 10,
  },
  birdBody: {
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    backgroundColor: '#FFD700',
    borderRadius: BIRD_SIZE / 2,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  birdEye: {
    position: 'absolute',
    top: 10,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#333',
  },
  birdPupil: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 4,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  birdBeak: {
    position: 'absolute',
    top: 18,
    right: -8,
    width: 12,
    height: 8,
    backgroundColor: '#FF6347',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#FF4500',
  },
  birdWing: {
    position: 'absolute',
    top: 22,
    left: 5,
    width: 18,
    height: 12,
    backgroundColor: '#FFA500',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  pipe: {
    position: 'absolute',
    width: PIPE_WIDTH,
    backgroundColor: '#5cb85c',
    borderWidth: 3,
    borderColor: '#4a934a',
  },
  pipeTop: {
    top: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  pipeBottom: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    height: GROUND_HEIGHT,
    backgroundColor: '#DEB887',
    borderTopWidth: 3,
    borderTopColor: '#8B7355',
  },
  score: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    zIndex: 100,
  },
  startScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  gameOverScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  finalScore: {
    fontSize: 32,
    color: 'white',
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#45a049',
  },
  restartButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

