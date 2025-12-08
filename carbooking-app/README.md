# 🚗 Car Booking App (차량 예약 앱)

Expo SDK 54로 제작된 현대적인 React Native 차량 예약 애플리케이션입니다.

---

## ✨ 주요 기능

- 🚗 다양한 차량을 아름다운 UI로 둘러보기
- 🔍 차량 검색 및 필터 기능
- 📱 차량 상세 정보 확인
- 📅 날짜 선택을 통한 차량 예약
- 📋 예약 내역 조회
- 💳 자동 렌탈 비용 계산

---

## 🚀 시작하기

### 📌 사전 준비물

- Node.js (v18 이상)

- npm 또는 yarn

- Expo CLI  

  ```
  npm install -g expo-cli
  ```

---

### 📥 설치

1. 의존성 설치:

```
npm install
```

2. 개발 서버 실행:

```
npm start
```

3. 실행 방법:
   - `i` → iOS 시뮬레이터 실행
   - `a` → Android 에뮬레이터 실행
   - 실제 기기에서 Expo Go 앱으로 QR 코드 스캔해 실행

---

## 📁 프로젝트 구조

```
carbooking-app/
├── App.js                 # 메인 앱 엔트리 포인트
├── screens/               # 화면 컴포넌트
│   ├── HomeScreen.js
│   ├── CarDetailsScreen.js
│   ├── BookingScreen.js
│   └── BookingsHistoryScreen.js
├── components/            # 재사용 가능한 컴포넌트
│   └── CarCard.js
├── data/                  # 데이터 파일
│   └── cars.js
└── assets/               # 이미지 및 에셋
```

---

## 🛠 사용 기술

- React Native
- Expo SDK 54
- React Navigation
- Expo Linear Gradient
- JavaScript

---

## 📄 라이선스

MIT