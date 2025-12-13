// 필요한 모듈 불러오기
const express = require('express');  // Express 웹 프레임워크
const cors = require('cors');  // CORS (Cross-Origin Resource Sharing) 설정
const multer = require('multer');  // 파일 업로드 처리
const path = require('path');  // 파일 경로 처리
const fs = require('fs');  // 파일 시스템 처리
const { createNotice, getAllNotices, getNoticeById } = require('./database');  // 데이터베이스 함수들

// Express 앱 생성
const app = express();
const PORT = 3000;  // 서버 포트 번호

// ===== 미들웨어 설정 =====
// 미들웨어: 요청(request)과 응답(response) 사이에서 실행되는 함수

// CORS 설정: 다른 도메인(모바일 앱)에서 API 호출 허용
app.use(cors());

// JSON 형식의 요청 본문(body)을 파싱
app.use(express.json());

// URL-encoded 형식의 요청 본문을 파싱 (폼 데이터)
app.use(express.urlencoded({ extended: true }));

// ===== 파일 업로드 설정 =====

// 업로드된 이미지를 저장할 디렉토리 경로
const uploadDir = path.join(__dirname, 'uploads');

// uploads 폴더가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer 저장소 설정
const storage = multer.diskStorage({
  // 파일이 저장될 위치
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // 저장될 파일명 설정 (중복 방지를 위해 타임스탬프 + 랜덤숫자 사용)
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // 예: image-1234567890-987654321.jpg
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer 미들웨어 생성
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 파일 크기 제한: 10MB
  // 파일 필터: 이미지 파일만 허용
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;  // 허용할 파일 확장자
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);  // 이미지 파일이면 허용
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));  // 거부
    }
  }
});

// '/uploads' 경로로 요청이 오면 uploads 폴더의 파일을 제공
// 예: http://localhost:3000/uploads/image-123.jpg
app.use('/uploads', express.static(uploadDir));

// ===== API 엔드포인트 =====

/**
 * [POST] 알림장 생성 API
 * 경로: /api/notices
 * 요청: FormData (title, content, image)
 * 응답: { success: true, notice: {...} }
 */
app.post('/api/notices', upload.single('image'), (req, res) => {
  // req.body: 텍스트 데이터 (title, content)
  // req.file: 업로드된 파일 정보
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // 필수 입력값 검증
  if (!title || !content) {
    return res.status(400).json({ error: '제목과 내용은 필수입니다.' });
  }

  // 데이터베이스에 알림장 저장
  createNotice(title, content, imageUrl, (err, notice) => {
    if (err) {
      console.error('알림장 생성 오류:', err);
      return res.status(500).json({ error: '알림장 생성에 실패했습니다.' });
    }
    // 성공 응답
    res.json({ success: true, notice });
  });
});

/**
 * [GET] 모든 알림장 조회 API
 * 경로: /api/notices
 * 응답: { success: true, notices: [...] }
 */
app.get('/api/notices', (req, res) => {
  getAllNotices((err, notices) => {
    if (err) {
      console.error('알림장 조회 오류:', err);
      return res.status(500).json({ error: '알림장 조회에 실패했습니다.' });
    }
    // 최신순으로 정렬된 알림장 목록 반환
    res.json({ success: true, notices });
  });
});

/**
 * [GET] 특정 알림장 조회 API
 * 경로: /api/notices/:id
 * 예: /api/notices/1
 * 응답: { success: true, notice: {...} }
 */
app.get('/api/notices/:id', (req, res) => {
  // URL 파라미터에서 id 추출
  const id = parseInt(req.params.id);
  
  getNoticeById(id, (err, notice) => {
    if (err) {
      console.error('알림장 조회 오류:', err);
      return res.status(500).json({ error: '알림장 조회에 실패했습니다.' });
    }
    if (!notice) {
      // 404: Not Found
      return res.status(404).json({ error: '알림장을 찾을 수 없습니다.' });
    }
    res.json({ success: true, notice });
  });
});

// ===== 서버 시작 =====
// '0.0.0.0'을 사용하면 모든 네트워크 인터페이스에서 연결 가능
// (localhost뿐만 아니라 같은 Wi-Fi 내의 모바일 기기에서도 접속 가능)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 http://0.0.0.0:${PORT} 에서 실행 중입니다.`);
  console.log(`로컬 네트워크에서 접속하려면: http://192.168.219.101:${PORT}`);
});

