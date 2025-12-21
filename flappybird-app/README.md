# Flappy Bird - React Native App

React Native Expo SDK 54를 사용한 Flappy Bird 게임입니다.

## 기능

- 🐦 터치로 새를 조종
- 🎮 물리 기반 게임플레이
- 🚀 파이프 장애물 회피
- 🎯 점수 시스템
- 💥 충돌 감지
- 🔄 게임 재시작

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# iOS에서 실행
npm run ios

# Android에서 실행
npm run android
```

## 게임 방법

1. 화면을 탭해서 게임을 시작합니다
2. 탭하면 새가 위로 점프합니다
3. 파이프 사이를 통과하면 점수를 획득합니다
4. 파이프나 땅에 부딪히면 게임이 종료됩니다
5. 게임 오버 후 "다시 시작" 버튼으로 재시작할 수 있습니다

## 기술 스택

- React Native 0.76.5
- Expo SDK 54
- JavaScript

## 게임 설정

게임의 난이도와 동작을 조정하려면 `App.js`의 상수를 수정하세요:

- `GRAVITY`: 중력 (기본값: 0.6)
- `JUMP_VELOCITY`: 점프 속도 (기본값: -12)
- `PIPE_GAP`: 파이프 사이 간격 (기본값: 180)
- `PIPE_SPACING`: 파이프 간 거리 (기본값: 220)

