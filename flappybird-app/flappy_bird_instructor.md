# Flappy Bird 코드 완전 정복 가이드 📚

초심자를 위한 단계별 설명서입니다. React Native가 처음이어도 괜찮아요!

---

## 목차
1. [기본 개념 이해하기](#1-기본-개념-이해하기)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [코드 상세 분석](#3-코드-상세-분석)
4. [게임 로직의 흐름](#4-게임-로직의-흐름)
5. [핵심 개념 정리](#5-핵심-개념-정리)

---

## 1. 기본 개념 이해하기

### React Native란?
JavaScript로 iOS와 Android 앱을 동시에 만들 수 있는 프레임워크입니다. 
웹 개발과 비슷하지만, HTML 대신 `View`, `Text` 같은 모바일 전용 컴포넌트를 사용합니다.

### React Hooks란?
함수형 컴포넌트에서 상태(state)와 생명주기(lifecycle)를 관리할 수 있게 해주는 기능입니다.
- `useState`: 값을 저장하고 변경하기
- `useEffect`: 특정 조건에서 코드 실행하기
- `useRef`: 변하지 않는 값을 참조하기

### 게임 루프란?
게임이 실행되는 동안 계속 반복되는 코드입니다. 이 앱에서는 1초에 60번(60 FPS) 실행되어 부드러운 애니메이션을 만듭니다.

---

## 2. 프로젝트 구조

```
flappybird-app/
├── App.js           # 메인 게임 코드 (이 파일을 분석할 거예요!)
├── package.json     # 프로젝트 의존성
├── app.json         # Expo 설정
└── README.md        # 프로젝트 소개
```

---

## 3. 코드 상세 분석

### 3.1 Import 구문 (1-10줄)

```javascript
import React, { useState, useEffect, useRef } from 'react';
```
**설명**: React와 필요한 훅(Hook)들을 가져옵니다.
- `useState`: 게임 상태를 관리 (예: 점수, 새의 위치)
- `useEffect`: 게임 루프를 실행
- `useRef`: 애니메이션 값을 저장

```javascript
import {
  StyleSheet,    // CSS 같은 스타일 정의
  View,          // HTML의 div 같은 컨테이너
  Text,          // 텍스트 표시
  Dimensions,    // 화면 크기 가져오기
  TouchableOpacity,  // 터치 가능한 영역
  Animated,      // 애니메이션 효과
} from 'react-native';
```

---

### 3.2 게임 설정 상수 (12-21줄)

```javascript
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
```
**설명**: 사용자의 스마트폰 화면 크기를 가져옵니다.
- iPhone이든 Galaxy든 자동으로 맞춰집니다!

```javascript
const GRAVITY = 0.6;           // 중력 (새가 떨어지는 속도)
const JUMP_VELOCITY = -12;     // 점프 속도 (음수 = 위로)
const BIRD_SIZE = 40;          // 새 크기
const PIPE_WIDTH = 60;         // 파이프 너비
const PIPE_GAP = 180;          // 파이프 사이 간격
const PIPE_SPACING = 220;      // 파이프 간 거리
const GROUND_HEIGHT = 100;     // 땅 높이
```

**💡 팁**: 이 값들을 바꾸면 게임 난이도가 변합니다!
- `GRAVITY`를 크게 → 더 어려워짐
- `PIPE_GAP`을 크게 → 더 쉬워짐

---

### 3.3 State(상태) 관리 (25-41줄)

#### 게임 상태
```javascript
const [gameStarted, setGameStarted] = useState(false);
```
**이해하기**: 
- `gameStarted`는 현재 값 (처음엔 false)
- `setGameStarted`는 값을 바꾸는 함수
- 게임이 시작되면 `setGameStarted(true)` 호출

```javascript
const [gameOver, setGameOver] = useState(false);  // 게임 오버 여부
const [score, setScore] = useState(0);            // 현재 점수
```

#### 새의 상태
```javascript
const [birdY, setBirdY] = useState(SCREEN_HEIGHT / 2 - BIRD_SIZE / 2);
```
**설명**: 새의 Y 좌표 (세로 위치)
- 처음엔 화면 중앙에 배치
- `setBirdY`로 위치를 계속 업데이트

```javascript
const [birdVelocity, setBirdVelocity] = useState(0);
```
**설명**: 새의 속도
- 0 = 정지
- 양수 = 아래로 이동
- 음수 = 위로 이동

#### 파이프 배열
```javascript
const [pipes, setPipes] = useState([
  { x: SCREEN_WIDTH + 100, topHeight: 150, passed: false },
  { x: SCREEN_WIDTH + 100 + PIPE_SPACING, topHeight: 250, passed: false },
  { x: SCREEN_WIDTH + 100 + PIPE_SPACING * 2, topHeight: 100, passed: false },
]);
```
**설명**: 3개의 파이프를 배열로 관리
- `x`: 파이프의 가로 위치 (화면 오른쪽부터 시작)
- `topHeight`: 위쪽 파이프 높이
- `passed`: 새가 통과했는지 여부 (점수 계산용)

#### Ref 사용
```javascript
const gameLoop = useRef(null);
```
**설명**: 게임 루프의 타이머를 저장 (나중에 멈추기 위해)

```javascript
const birdRotation = useRef(new Animated.Value(0)).current;
```
**설명**: 새의 회전 각도를 애니메이션으로 관리

---

### 3.4 게임 루프 - useEffect (44-113줄)

이 부분이 게임의 핵심입니다! 🎮

```javascript
useEffect(() => {
  if (gameStarted && !gameOver) {
    // 게임이 시작되고 게임오버가 아닐 때만 실행
```

#### 타이머 시작
```javascript
gameLoop.current = setInterval(() => {
  // 이 코드가 1초에 60번 실행됨 (60 FPS)
}, 1000 / 60);
```

#### 1️⃣ 새의 물리 업데이트 (47-58줄)
```javascript
setBirdVelocity((v) => v + GRAVITY);
```
**설명**: 중력 적용! 속도가 계속 증가하면서 새가 점점 빨리 떨어집니다.

```javascript
setBirdY((y) => {
  const newY = y + birdVelocity;  // 새로운 위치 계산
  
  // 충돌 검사: 천장이나 땅에 부딪혔나?
  if (newY > SCREEN_HEIGHT - GROUND_HEIGHT - BIRD_SIZE || newY < 0) {
    setGameOver(true);  // 게임 오버!
    return y;           // 위치 그대로 유지
  }
  return newY;  // 새 위치로 업데이트
});
```

**물리 법칙 이해하기**:
1. 중력으로 속도 증가: `velocity = velocity + GRAVITY`
2. 속도로 위치 변경: `position = position + velocity`
3. 점프 시 속도를 음수로: 위로 올라감!

#### 2️⃣ 새 회전 애니메이션 (60-65줄)
```javascript
Animated.timing(birdRotation, {
  toValue: Math.min(Math.max(birdVelocity * 3, -30), 90),
  duration: 100,
  useNativeDriver: true,
}).start();
```
**설명**: 새의 속도에 따라 각도 변경
- 위로 올라갈 때: 머리를 위로 (-30도)
- 떨어질 때: 머리를 아래로 (90도)
- `useNativeDriver`: 부드러운 애니메이션을 위해 네이티브 코드 사용

#### 3️⃣ 파이프 이동과 충돌 검사 (67-108줄)

##### 파이프 이동
```javascript
const newX = pipe.x - 3;  // 왼쪽으로 3픽셀 이동
```

##### 파이프 재생성
```javascript
if (newX < -PIPE_WIDTH) {
  // 파이프가 화면 왼쪽을 벗어나면
  const randomHeight = Math.random() * (...) + 50;  // 랜덤 높이
  return {
    x: SCREEN_WIDTH + 50,  // 화면 오른쪽에 새로 생성
    topHeight: randomHeight,
    passed: false,
  };
}
```
**핵심**: 무한 스크롤 효과! 파이프를 계속 재활용합니다.

##### 점수 계산
```javascript
if (!pipe.passed && newX + PIPE_WIDTH < SCREEN_WIDTH / 2 - BIRD_SIZE / 2) {
  // 새가 파이프를 통과했고, 아직 점수를 안 받았으면
  setScore((s) => s + 1);  // 점수 +1
  return { ...pipe, x: newX, passed: true };  // 통과 표시
}
```

##### 충돌 검사 - 직사각형 충돌 알고리즘
```javascript
// 새의 영역
const birdLeft = SCREEN_WIDTH / 2 - BIRD_SIZE / 2;
const birdRight = SCREEN_WIDTH / 2 + BIRD_SIZE / 2;
const birdTop = birdY;
const birdBottom = birdY + BIRD_SIZE;

// 파이프 영역
const pipeLeft = newX;
const pipeRight = newX + PIPE_WIDTH;
const topPipeBottom = pipe.topHeight;
const bottomPipeTop = pipe.topHeight + PIPE_GAP;

// 충돌 검사
if (birdRight > pipeLeft && birdLeft < pipeRight) {
  // 새와 파이프가 가로로 겹침
  if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
    // 위쪽 파이프나 아래쪽 파이프에 부딪힘
    setGameOver(true);
  }
}
```

**시각적 이해**:
```
     [위쪽 파이프]
           |
           |  ← topPipeBottom
        
        🐦  ← 새가 여기를 통과해야 함 (간격)
        
           |  ← bottomPipeTop
           |
     [아래쪽 파이프]
```

#### 정리 함수
```javascript
return () => clearInterval(gameLoop.current);
```
**설명**: 컴포넌트가 사라지거나 게임이 멈출 때 타이머를 정리합니다.
(메모리 누수 방지!)

---

### 3.5 사용자 인터랙션 함수들

#### 점프 함수 (115-123줄)
```javascript
const jump = () => {
  if (!gameStarted) {
    setGameStarted(true);  // 첫 탭: 게임 시작
  }
  if (!gameOver) {
    setBirdVelocity(JUMP_VELOCITY);  // 속도를 음수로 → 위로!
  }
};
```
**포인트**: 속도만 바꿉니다! 위치는 게임 루프에서 자동으로 업데이트됩니다.

#### 재시작 함수 (125-138줄)
```javascript
const restart = () => {
  setGameOver(false);
  setGameStarted(false);
  setScore(0);
  setBirdY(SCREEN_HEIGHT / 2 - BIRD_SIZE / 2);  // 초기 위치
  setBirdVelocity(0);  // 정지 상태
  setPipes([...]);  // 파이프 초기화
  birdRotation.setValue(0);  // 회전 초기화
};
```

---

### 3.6 UI 렌더링 (145-228줄)

#### 회전 각도 계산
```javascript
const rotation = birdRotation.interpolate({
  inputRange: [-30, 90],       // 입력 범위
  outputRange: ['-30deg', '90deg'],  // 출력 범위
});
```
**설명**: 숫자 값을 각도 문자열로 변환

#### JSX 구조
```javascript
return (
  <View style={styles.container}>
    {/* 메인 컨테이너 */}
    
    <View style={styles.background}>
      {/* 게임 화면 */}
      
      {/* 1. 점수 표시 */}
      {gameStarted && (
        <Text style={styles.score}>{score}</Text>
      )}
      
      {/* 2. 새 */}
      <Animated.View style={[styles.bird, { top: birdY, ... }]} />
      
      {/* 3. 파이프들 */}
      {pipes.map((pipe, index) => (...))}
      
      {/* 4. 땅 */}
      <View style={styles.ground} />
      
      {/* 5. 시작 화면 */}
      {!gameStarted && !gameOver && (...)}
      
      {/* 6. 게임 오버 화면 */}
      {gameOver && (...)}
      
      {/* 7. 전체 화면 터치 영역 */}
      <TouchableOpacity style={styles.tapArea} onPress={jump} />
    </View>
  </View>
);
```

#### 조건부 렌더링 이해하기
```javascript
{gameStarted && <Text>{score}</Text>}
```
**의미**: gameStarted가 true일 때만 점수를 보여줌

```javascript
{!gameStarted && !gameOver && <View>시작 화면</View>}
```
**의미**: 시작 전이고 게임오버도 아닐 때만 시작 화면 표시

#### 배열 렌더링
```javascript
{pipes.map((pipe, index) => (
  <View key={index}>
    {/* 각 파이프에 대해 위쪽/아래쪽 파이프 2개 생성 */}
  </View>
))}
```
**설명**: 
- `map`은 배열의 각 요소를 변환
- 3개 파이프 × 2(위/아래) = 6개 View 생성
- `key`는 React가 각 요소를 구별하기 위해 필요

#### pointerEvents 속성
```javascript
<View style={styles.startScreen} pointerEvents="none">
```
**설명**: 
- `"none"`: 터치 이벤트가 이 View를 통과
- 시작 화면이 보이지만 아래의 탭 영역이 클릭됨!

```javascript
<View style={styles.gameOverScreen} pointerEvents="box-none">
```
**설명**: 
- `"box-none"`: View 자체는 터치 안 받지만 자식 요소는 받음
- 배경은 클릭 안 되지만 "다시 시작" 버튼은 클릭 가능!

---

### 3.7 스타일 정의 (230-357줄)

#### StyleSheet.create 사용
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,  // 전체 화면 차지
    backgroundColor: '#70c5ce',  // 하늘색
  },
  // ...
});
```

#### Position 이해하기
```javascript
bird: {
  position: 'absolute',  // 절대 위치 (부모 기준)
  width: BIRD_SIZE,
  height: BIRD_SIZE,
  backgroundColor: '#FFD700',  // 황금색
  borderRadius: BIRD_SIZE / 2,  // 원형
  zIndex: 10,  // 다른 요소 위에 표시
}
```

**position 종류**:
- `absolute`: 부모 기준 절대 위치
- `relative`: 원래 위치 기준

**zIndex**: 숫자가 클수록 위에 표시

#### 그림자 효과
```javascript
score: {
  textShadowColor: 'rgba(0, 0, 0, 0.3)',  // 그림자 색
  textShadowOffset: { width: 2, height: 2 },  // 그림자 위치
  textShadowRadius: 3,  // 그림자 흐림 정도
}
```

#### 전체 화면 오버레이
```javascript
startScreen: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,  // 4방향 모두 0 = 전체 화면
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 반투명 검정
  zIndex: 1000,  // 맨 위에
}
```

---

## 4. 게임 로직의 흐름

### 전체 흐름도

```
┌─────────────┐
│  앱 시작    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  시작 화면  │ ← gameStarted = false
│  표시       │   gameOver = false
└──────┬──────┘
       │ 화면 탭
       ▼
┌─────────────┐
│ 게임 시작   │ ← gameStarted = true
│ 게임 루프   │   setInterval 시작
│ 실행        │
└──────┬──────┘
       │ 60 FPS
       ▼
┌──────────────────────────────┐
│  매 프레임마다:              │
│  1. 중력 적용 (속도 증가)    │
│  2. 새 위치 업데이트         │
│  3. 새 회전 애니메이션       │
│  4. 파이프 이동              │
│  5. 충돌 검사                │
│  6. 점수 계산                │
└──────┬───────────────────┬───┘
       │                   │
       │ 충돌!             │ 계속 진행
       ▼                   │
┌─────────────┐            │
│ 게임 오버   │ ← gameOver = true
│ 화면 표시   │   clearInterval
└──────┬──────┘            │
       │                   │
       │ 재시작 버튼        │
       ▼                   │
┌─────────────┐            │
│ 상태 초기화 │            │
└──────┬──────┘            │
       │                   │
       └───────────────────┘
```

### 주요 상태 변화

```
초기 상태:
- gameStarted: false
- gameOver: false
- birdY: 화면 중앙
- birdVelocity: 0
- score: 0

첫 탭:
→ gameStarted: true
→ birdVelocity: -12
→ 게임 루프 시작

매 프레임 (60 FPS):
→ birdVelocity += 0.6 (중력)
→ birdY += birdVelocity
→ pipes[].x -= 3
→ 충돌 검사

충돌 시:
→ gameOver: true
→ 게임 루프 정지

재시작:
→ 모든 상태 초기값으로
```

---

## 5. 핵심 개념 정리

### 5.1 React Hooks 심화

#### useState의 함수형 업데이트
```javascript
// ❌ 잘못된 방법
setBirdVelocity(birdVelocity + GRAVITY);

// ✅ 올바른 방법
setBirdVelocity((v) => v + GRAVITY);
```
**이유**: 함수형 업데이트는 항상 최신 값을 보장합니다.

#### useEffect 의존성 배열
```javascript
useEffect(() => {
  // 코드
}, [gameStarted, gameOver, birdVelocity, birdY]);
```
**설명**: 배열 안의 값이 변경될 때마다 useEffect가 다시 실행됩니다.

### 5.2 게임 개발 핵심 개념

#### 1. 게임 루프 (Game Loop)
모든 게임의 기본! 계속 반복하면서:
1. 입력 처리 (터치)
2. 상태 업데이트 (위치, 속도)
3. 화면 렌더링

#### 2. 물리 엔진 (Physics)
```
속도(velocity) = 속도 + 가속도(중력)
위치(position) = 위치 + 속도
```

#### 3. 충돌 감지 (Collision Detection)
AABB (Axis-Aligned Bounding Box) 알고리즘:
```javascript
// 두 직사각형이 겹치는가?
if (rect1.right > rect2.left &&
    rect1.left < rect2.right &&
    rect1.bottom > rect2.top &&
    rect1.top < rect2.bottom) {
  // 충돌!
}
```

#### 4. 객체 풀링 (Object Pooling)
파이프를 새로 만들지 않고 재활용:
- 메모리 효율적
- 성능 향상
- 무한 스크롤 구현

### 5.3 React Native 특수 기능

#### 1. Dimensions API
```javascript
const { width, height } = Dimensions.get('window');
```
다양한 화면 크기에 대응!

#### 2. Animated API
```javascript
const value = new Animated.Value(0);

Animated.timing(value, {
  toValue: 100,
  duration: 1000,
  useNativeDriver: true,  // 성능 최적화!
}).start();
```

#### 3. TouchableOpacity
```javascript
<TouchableOpacity onPress={함수} activeOpacity={0.7}>
```
- 터치 시 투명도 변화
- `activeOpacity={1}`: 효과 없음 (전체 화면 탭용)

---

## 🎯 학습 체크리스트

### 기본 이해
- [ ] React Native 컴포넌트 (View, Text, TouchableOpacity)
- [ ] useState로 상태 관리하기
- [ ] useEffect로 생명주기 관리하기
- [ ] StyleSheet로 스타일 정의하기

### 중급 개념
- [ ] 게임 루프의 동작 원리
- [ ] setInterval과 clearInterval
- [ ] 배열 map으로 반복 렌더링
- [ ] 조건부 렌더링 (&&, 삼항 연산자)

### 고급 기능
- [ ] Animated API 사용법
- [ ] 충돌 감지 알고리즘
- [ ] 함수형 setState
- [ ] pointerEvents 활용

### 게임 로직
- [ ] 물리 엔진 (중력, 속도, 위치)
- [ ] 무한 스크롤 구현
- [ ] 점수 시스템
- [ ] 게임 상태 관리

---

## 💡 연습 과제

### 초급
1. 새의 색깔을 파란색으로 바꿔보세요
2. 점수 글자 크기를 더 크게 만들어보세요
3. 게임 시작 메시지를 영어로 바꿔보세요

### 중급
1. 중력 값을 0.3으로 줄여서 쉬운 모드 만들기
2. 파이프 간격을 200으로 늘려보기
3. 새가 점프할 때 소리 추가하기 (expo-av 사용)

### 고급
1. 최고 점수(High Score) 저장하기 (AsyncStorage)
2. 낮/밤 모드 추가하기
3. 파이프 색깔을 랜덤으로 바꾸기
4. 장애물 종류 추가하기 (움직이는 장애물)

---

## 🐛 자주 발생하는 문제와 해결법

### 1. 게임이 너무 빨라요!
```javascript
const GRAVITY = 0.3;  // 0.6 → 0.3으로 줄이기
```

### 2. 새가 화면 밖으로 나가요!
충돌 검사 코드를 확인하세요:
```javascript
if (newY > SCREEN_HEIGHT - GROUND_HEIGHT - BIRD_SIZE || newY < 0)
```

### 3. 점수가 이상하게 증가해요!
`passed` 플래그를 확인하세요:
```javascript
if (!pipe.passed && ...) {
  // passed가 false일 때만 점수 증가
}
```

### 4. 게임이 멈춰요!
useEffect의 정리 함수를 확인하세요:
```javascript
return () => clearInterval(gameLoop.current);
```

---

## 📚 더 공부하기

### 공식 문서
- [React Native 공식 문서](https://reactnative.dev/)
- [Expo 공식 문서](https://docs.expo.dev/)
- [React Hooks 가이드](https://react.dev/reference/react)

### 관련 개념
- JavaScript 기초 (ES6+)
- React 기초
- 게임 개발 기초
- 모바일 UI/UX 디자인

### 다음 단계
1. TypeScript로 변환하기
2. 애니메이션 효과 추가
3. 사운드 효과 추가
4. 리더보드 구현
5. 멀티플레이어 기능

---

## 🎉 마무리

축하합니다! 이제 Flappy Bird 코드를 완전히 이해했습니다.

**핵심 요약**:
1. **게임 루프**: 60 FPS로 계속 실행
2. **물리 엔진**: 중력과 속도로 자연스러운 움직임
3. **상태 관리**: React Hooks로 게임 상태 제어
4. **충돌 감지**: 직사각형 겹침 알고리즘
5. **React Native**: 크로스 플랫폼 모바일 앱 개발

이제 여러분만의 게임을 만들어보세요! 🚀

---

**제목**: Flappy Bird 튜토리얼
**버전**: 1.0
**최종 수정**: 2025년

