// SQLite3 모듈 불러오기
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ===== 데이터베이스 설정 =====

// 데이터베이스 파일이 저장될 경로
// __dirname: 현재 파일이 있는 디렉토리
const dbPath = path.join(__dirname, 'pet_notice.db');

// 데이터베이스 연결
// 파일이 없으면 자동으로 생성됨
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
  } else {
    console.log('SQLite 데이터베이스에 연결되었습니다.');
    initDatabase();  // 테이블 초기화
  }
});

// ===== 데이터베이스 초기화 =====

/**
 * notices 테이블 생성
 * 
 * 테이블 구조:
 * - id: 자동 증가하는 고유 ID (기본 키)
 * - title: 알림장 제목 (필수)
 * - content: 알림장 내용 (필수)
 * - image_url: 이미지 파일 경로 (선택)
 * - created_at: 생성 시간 (자동 설정)
 */
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('테이블 생성 오류:', err.message);
    } else {
      console.log('notices 테이블이 준비되었습니다.');
    }
  });
}

// ===== 데이터베이스 함수들 =====

/**
 * 알림장 생성
 * @param {string} title - 제목
 * @param {string} content - 내용
 * @param {string} imageUrl - 이미지 URL (선택)
 * @param {function} callback - 콜백 함수 (err, notice)
 */
function createNotice(title, content, imageUrl, callback) {
  // SQL 쿼리: INSERT (삽입)
  // ? : 플레이스홀더 (SQL 인젝션 방지)
  const sql = `INSERT INTO notices (title, content, image_url) VALUES (?, ?, ?)`;
  
  db.run(sql, [title, content, imageUrl], function(err) {
    if (err) {
      callback(err, null);
    } else {
      // this.lastID: 방금 삽입된 행의 ID
      callback(null, { id: this.lastID, title, content, image_url: imageUrl });
    }
  });
}

/**
 * 모든 알림장 조회 (최신순)
 * @param {function} callback - 콜백 함수 (err, notices)
 */
function getAllNotices(callback) {
  // SQL 쿼리: SELECT (조회)
  // ORDER BY created_at DESC: 생성일시 내림차순 정렬 (최신이 먼저)
  const sql = `SELECT * FROM notices ORDER BY created_at DESC`;
  
  // db.all(): 모든 행을 배열로 반환
  db.all(sql, [], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

/**
 * 특정 ID의 알림장 조회
 * @param {number} id - 알림장 ID
 * @param {function} callback - 콜백 함수 (err, notice)
 */
function getNoticeById(id, callback) {
  const sql = `SELECT * FROM notices WHERE id = ?`;
  
  // db.get(): 단일 행만 반환
  db.get(sql, [id], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

// 다른 파일에서 사용할 수 있도록 export
module.exports = {
  db,
  createNotice,
  getAllNotices,
  getNoticeById
};

