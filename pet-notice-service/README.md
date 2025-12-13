# 🐾 애완견 알림장 서비스

애완견 돌봄 서비스를 위한 알림장 앱입니다. 선생님이 애완견의 활동 사진과 내용을 작성하면, 고객이 이를 확인할 수 있습니다.

## 📋 프로젝트 구조

```
pet-notice-service/
├── backend/          # Express + SQLite 백엔드
│   ├── server.js     # Express 서버
│   ├── database.js   # SQLite 데이터베이스 설정
│   └── package.json
└── frontend/         # React Native Expo 프론트엔드
    ├── app/          # 화면 컴포넌트
    ├── store/        # Zustand 상태관리
    └── package.json
```

## 🚀 시작하기

### 백엔드 설정

1. 백엔드 디렉토리로 이동:
```bash
cd backend
```

2. 의존성 설치:
```bash
npm install
```

3. 서버 실행:
```bash
npm start
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 프론트엔드 설정

1. 프론트엔드 디렉토리로 이동:
```bash
cd frontend
```

2. 의존성 설치:
```bash
npm install
```

3. 앱 실행:
```bash
npm start
```

Expo 개발 서버가 시작되면, QR 코드를 스캔하여 앱을 실행할 수 있습니다.

## 📱 주요 기능

### 선생님 화면
- 제목과 내용으로 알림장 작성
- 갤러리에서 사진 선택 또는 카메라로 촬영
- 알림장 등록

### 고객 화면
- 등록된 알림장 목록 보기
- 알림장 상세 내용 확인
- 새로고침으로 최신 알림장 불러오기

## 🔧 기술 스택

### 백엔드
- **Express**: 웹 서버 프레임워크
- **SQLite**: 경량 데이터베이스
- **Multer**: 파일 업로드 처리

### 프론트엔드
- **React Native**: 크로스 플랫폼 모바일 앱
- **Expo SDK 54**: React Native 개발 도구
- **Zustand**: 상태 관리 라이브러리
- **Expo Router**: 파일 기반 라우팅

## 📝 API 엔드포인트

### 알림장 생성
```
POST /api/notices
Content-Type: multipart/form-data

{
  title: string,
  content: string,
  image: file (optional)
}
```

### 모든 알림장 조회
```
GET /api/notices
```

### 특정 알림장 조회
```
GET /api/notices/:id
```

## ⚠️ 주의사항

### 실제 기기에서 테스트하는 경우

프론트엔드에서 백엔드 API를 호출할 때, 실제 기기나 에뮬레이터에서는 `localhost` 대신 실제 IP 주소를 사용해야 합니다.

1. 컴퓨터의 로컬 IP 주소 확인:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

2. `frontend/store/noticeStore.js` 파일에서 API_URL 수정:
```javascript
const API_URL = 'http://YOUR_IP_ADDRESS:3000/api';
```

예: `http://192.168.0.100:3000/api`

3. 백엔드 서버가 해당 IP에서 접근 가능하도록 방화벽 설정 확인

## 📚 학습 포인트

이 프로젝트는 React Native 초심자를 위한 샘플 코드입니다. 다음 개념들을 학습할 수 있습니다:

1. **Expo Router**: 파일 기반 라우팅 시스템
2. **Zustand**: 간단한 상태 관리
3. **이미지 처리**: Expo Image Picker 사용법
4. **API 통신**: Fetch API를 사용한 서버 통신
5. **FormData**: 파일 업로드 처리

## 🎯 다음 단계

프로젝트를 확장하고 싶다면:

- 사용자 인증 추가
- 푸시 알림 기능
- 댓글 기능
- 알림장 수정/삭제 기능
- 다중 이미지 업로드

## 📄 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

