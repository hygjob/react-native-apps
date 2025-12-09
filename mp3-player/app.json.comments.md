# app.json 설정 파일 설명

이 문서는 `app.json` 파일의 각 설정 항목에 대한 설명입니다.

## 기본 설정

### `name`
- **설명**: 앱 이름 (앱 스토어에 표시되는 이름)
- **값**: "mp3-player"

### `slug`
- **설명**: URL 슬러그 (Expo 서비스에서 사용되는 고유 식별자)
- **값**: "mp3-player"

### `version`
- **설명**: 앱 버전 번호
- **값**: "1.0.0"

### `orientation`
- **설명**: 화면 방향 설정
- **값**: "portrait" (세로 모드)
- **옵션**: 
  - "portrait": 세로 모드만
  - "landscape": 가로 모드만
  - "default": 둘 다 허용

### `icon`
- **설명**: 앱 아이콘 경로
- **값**: "./assets/icon.png"

### `userInterfaceStyle`
- **설명**: 사용자 인터페이스 스타일
- **값**: "light" (밝은 테마)
- **옵션**:
  - "light": 밝은 테마
  - "dark": 어두운 테마
  - "automatic": 시스템 설정 따름

### `newArchEnabled`
- **설명**: 새로운 아키텍처 활성화 여부 (React Native의 새 아키텍처 사용)
- **값**: true

## 스플래시 스크린 설정 (`splash`)

### `splash.image`
- **설명**: 스플래시 스크린 이미지 경로
- **값**: "./assets/splash-icon.png"

### `splash.resizeMode`
- **설명**: 이미지 리사이즈 모드
- **값**: "contain" (비율 유지하며 전체 표시)
- **옵션**:
  - "contain": 비율 유지하며 전체 표시
  - "cover": 화면을 채우도록 확대
  - "native": 원본 크기 유지

### `splash.backgroundColor`
- **설명**: 스플래시 스크린 배경색
- **값**: "#ffffff" (흰색)

## iOS 플랫폼 설정 (`ios`)

### `ios.supportsTablet`
- **설명**: iPad 지원 여부
- **값**: true

## Android 플랫폼 설정 (`android`)

### `android.adaptiveIcon`
- **설명**: 적응형 아이콘 설정 (Android 8.0 이상)
- **구성**:
  - `foregroundImage`: 포그라운드 이미지 경로 ("./assets/adaptive-icon.png")
  - `backgroundColor`: 배경색 ("#ffffff")

### `android.edgeToEdgeEnabled`
- **설명**: 엣지 투 엣지 모드 활성화 (Android 11 이상, 상태바와 네비게이션바 영역까지 사용)
- **값**: true

## 웹 플랫폼 설정 (`web`)

### `web.favicon`
- **설명**: 파비콘 경로
- **값**: "./assets/favicon.png"

