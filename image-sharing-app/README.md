# 이미지 공유 앱

이미지를 선택하고, 보고, 공유할 수 있는 React Native Expo 앱입니다. Expo SDK 54와 JavaScript로 만들어졌습니다.

## 기능

- 📷 갤러리에서 이미지 선택
- 📸 카메라로 사진 촬영
- 👁️ 선택한 이미지 보기
- 📤 다른 앱과 이미지 공유
- 📚 최근 이미지 히스토리 보기

## 사전 요구 사항

- Node.js (v14 이상)
- npm 또는 yarn
- Expo CLI (전역 설치 또는 npx를 통해)

## 설치

1. 의존성 설치:
```bash
npm install
```

## 앱 실행

1. Expo 개발 서버 시작:
```bash
npm start
```

2. 원하는 플랫폼에서 실행:
   - `i` 키를 눌러 iOS 시뮬레이터에서 실행
   - `a` 키를 눌러 Android 에뮬레이터에서 실행
   - 실제 기기에서 Expo Go 앱으로 QR 코드 스캔

## 플랫폼별 참고 사항

### iOS
- 카메라 및 사진 라이브러리 권한이 자동으로 요청됩니다
- iPhone과 iPad 모두 지원합니다

### Android
- 카메라 및 저장소 권한이 필요합니다 (app.json에서 설정)
- Android 5.0 이상에서 테스트됨

## 프로젝트 구조

```
image-sharing-app/
├── App.js              # 메인 애플리케이션 컴포넌트
├── app.json            # Expo 설정
├── package.json        # 의존성 및 스크립트
├── babel.config.js     # Babel 설정
└── README.md           # 이 파일
```

## 사용된 기술

- React Native
- Expo SDK 54
- expo-image-picker
- expo-sharing
- JavaScript

## 라이선스

MIT

