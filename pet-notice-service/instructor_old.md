# 애완견 알림장 서비스 - 초심자 가이드

## 📚 목차
1. [프로젝트 소개](#프로젝트-소개)
2. [기술 스택 설명](#기술-스택-설명)
3. [프로젝트 구조](#프로젝트-구조)
4. [백엔드 상세 설명](#백엔드-상세-설명)
5. [프론트엔드 상세 설명](#프론트엔드-상세-설명)
6. [주요 개념 학습](#주요-개념-학습)
7. [실습 과제](#실습-과제)

---

## 프로젝트 소개

이 프로젝트는 **애완견 돌봄 서비스**를 위한 알림장 앱입니다. 

### 핵심 기능
- **선생님**: 애완견의 활동 사진과 내용을 작성하여 등록
- **고객**: 등록된 알림장을 확인

### 학습 목표
- React Native 기본 개념 이해
- 백엔드와 프론트엔드 통신 방법 학습
- 상태 관리 (Zustand) 사용법
- 파일 업로드 처리
- REST API 개념

---

## 기술 스택 설명

### 백엔드
| 기술 | 역할 | 왜 사용하나요? |
|------|------|---------------|
| **Node.js** | JavaScript 런타임 | JavaScript로 서버를 만들 수 있음 |
| **Express** | 웹 프레임워크 | 간단하게 API 서버를 만들 수 있음 |
| **SQLite** | 데이터베이스 | 파일 기반으로 설치가 간단함 |
| **Multer** | 파일 업로드 | 이미지 파일을 쉽게 처리 |

### 프론트엔드
| 기술 | 역할 | 왜 사용하나요? |
|------|------|---------------|
| **React Native** | 모바일 앱 프레임워크 | 하나의 코드로 iOS/Android 모두 개발 |
| **Expo** | React Native 개발 도구 | 복잡한 설정 없이 빠르게 시작 가능 |
| **Zustand** | 상태 관리 | Redux보다 간단하고 쉬움 |
| **Expo Router** | 화면 이동 | 파일 기반 라우팅 (Next.js와 유사) |

---

## 프로젝트 구조

```
pet-notice-service/
├── backend/                      # 백엔드 (서버)
│   ├── server.js                 # Express 서버 및 API
│   ├── database.js               # SQLite 데이터베이스
│   ├── package.json              # 의존성 관리
│   ├── uploads/                  # 업로드된 이미지 저장
│   └── pet_notice.db             # SQLite 데이터베이스 파일
│
└── frontend/                     # 프론트엔드 (모바일 앱)
    ├── app/                      # 화면 컴포넌트 (Expo Router)
    │   ├── _layout.js            # 라우팅 설정
    │   ├── index.js              # 홈 화면
    │   ├── teacher.js            # 선생님 화면
    │   ├── customer.js           # 고객 화면
    │   └── notice-detail.js      # 알림장 상세
    ├── store/                    # 상태 관리
    │   └── noticeStore.js        # Zustand store
    ├── package.json              # 의존성 관리
    ├── app.json                  # Expo 설정
    └── babel.config.js           # Babel 설정
```

---

## 백엔드 상세 설명

### 1. Express 서버 (`backend/server.js`)

#### 미들웨어란?
요청(Request)과 응답(Response) 사이에서 실행되는 함수입니다.

```javascript
app.use(cors());              // 다른 도메인에서 API 호출 허용
app.use(express.json());      // JSON 형식의 요청 본문 파싱
```

#### API 엔드포인트

**1) 알림장 생성 (POST)**
```javascript
POST /api/notices
Content-Type: multipart/form-data

Body:
- title: 제목
- content: 내용
- image: 이미지 파일 (선택)
```

**2) 모든 알림장 조회 (GET)**
```javascript
GET /api/notices

응답:
{
  "success": true,
  "notices": [
    {
      "id": 1,
      "title": "오늘의 산책",
      "content": "공원에서 즐겁게 놀았어요",
      "image_url": "/uploads/image-123.jpg",
      "created_at": "2024-12-14 10:30:00"
    }
  ]
}
```

**3) 특정 알림장 조회 (GET)**
```javascript
GET /api/notices/:id

예: GET /api/notices/1
```

### 2. SQLite 데이터베이스 (`backend/database.js`)

#### 테이블 구조
```sql
CREATE TABLE notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 자동 증가 ID
  title TEXT NOT NULL,                   -- 제목 (필수)
  content TEXT NOT NULL,                 -- 내용 (필수)
  image_url TEXT,                        -- 이미지 경로 (선택)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- 생성 시간
);
```

#### SQL 기본 개념

**INSERT (삽입)**
```javascript
const sql = `INSERT INTO notices (title, content, image_url) VALUES (?, ?, ?)`;
db.run(sql, [title, content, imageUrl], callback);
```

**SELECT (조회)**
```javascript
const sql = `SELECT * FROM notices ORDER BY created_at DESC`;
db.all(sql, [], callback);  // 모든 행 반환
```

**WHERE (조건)**
```javascript
const sql = `SELECT * FROM notices WHERE id = ?`;
db.get(sql, [id], callback);  // 단일 행 반환
```

#### ? (플레이스홀더)를 사용하는 이유
SQL 인젝션 공격을 방지하기 위해 사용합니다.

❌ **나쁜 예 (취약)**
```javascript
const sql = `SELECT * FROM notices WHERE id = ${id}`;
```

✅ **좋은 예 (안전)**
```javascript
const sql = `SELECT * FROM notices WHERE id = ?`;
db.get(sql, [id], callback);
```

### 3. 파일 업로드 (Multer)

#### 저장소 설정
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // 저장 위치
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});
```

#### 파일명이 중복되지 않는 이유
타임스탬프(Date.now())와 랜덤 숫자를 조합하여 고유한 파일명을 생성합니다.

예: `image-1702534567890-987654321.jpg`

---

## 프론트엔드 상세 설명

### 1. React Native 기본 컴포넌트

| 웹 (HTML) | React Native | 설명 |
|-----------|--------------|------|
| `<div>` | `<View>` | 컨테이너 |
| `<span>` | `<Text>` | 텍스트 |
| `<input>` | `<TextInput>` | 입력 필드 |
| `<button>` | `<TouchableOpacity>` | 버튼 |
| `<img>` | `<Image>` | 이미지 |
| `<ul>` | `<FlatList>` | 리스트 |

### 2. React Hooks

#### useState - 상태 관리
```javascript
const [title, setTitle] = useState('');

// title: 현재 값
// setTitle: 값을 변경하는 함수
```

**예제**
```javascript
const [count, setCount] = useState(0);

// 값 읽기
console.log(count);  // 0

// 값 변경
setCount(5);  // count가 5로 변경됨
setCount(count + 1);  // count를 1 증가
```

#### useEffect - 부수 효과
컴포넌트가 화면에 표시되거나 값이 변경될 때 실행됩니다.

```javascript
// 처음 한 번만 실행
useEffect(() => {
  fetchNotices();
}, []);

// error가 변경될 때마다 실행
useEffect(() => {
  if (error) {
    Alert.alert('오류', error);
  }
}, [error]);
```

### 3. Zustand 상태 관리

#### 왜 상태 관리가 필요한가?
여러 컴포넌트에서 같은 데이터를 공유하기 위해 사용합니다.

```
HomeScreen
    ↓
TeacherScreen → [알림장 생성] → Zustand Store
    ↓
CustomerScreen ← [알림장 목록 조회] ← Zustand Store
```

#### Store 구조
```javascript
const useNoticeStore = create((set, get) => ({
  // 상태 (State)
  notices: [],
  loading: false,
  error: null,

  // 액션 (Action)
  fetchNotices: async () => { ... },
  createNotice: async () => { ... },
}));
```

#### 컴포넌트에서 사용
```javascript
// store에서 필요한 것만 가져오기
const { notices, loading, fetchNotices } = useNoticeStore();

// 함수 호출
fetchNotices();

// 상태 사용
console.log(notices);  // 알림장 목록
```

### 4. Expo Router (파일 기반 라우팅)

#### 파일 구조 = 라우팅
```
app/
├── index.js         → /        (홈)
├── teacher.js       → /teacher (선생님 화면)
└── customer.js      → /customer (고객 화면)
```

#### 화면 이동
```javascript
import { useRouter } from 'expo-router';

const router = useRouter();

// 다른 화면으로 이동
router.push('/teacher');

// 파라미터와 함께 이동
router.push({
  pathname: '/notice-detail',
  params: { id: 1 }
});
```

### 5. API 통신 (fetch)

#### GET 요청
```javascript
const response = await fetch('http://192.168.219.101:3000/api/notices');
const data = await response.json();
console.log(data.notices);
```

#### POST 요청 (JSON)
```javascript
const response = await fetch('http://192.168.219.101:3000/api/notices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '제목',
    content: '내용'
  })
});
```

#### POST 요청 (파일 업로드)
```javascript
const formData = new FormData();
formData.append('title', '제목');
formData.append('image', {
  uri: 'file:///path/to/image.jpg',
  name: 'image.jpg',
  type: 'image/jpeg'
});

const response = await fetch('http://192.168.219.101:3000/api/notices', {
  method: 'POST',
  body: formData,
  // Content-Type을 설정하지 않음 (자동 설정)
});
```

### 6. 스타일링 (StyleSheet)

#### Flexbox 레이아웃
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,              // 전체 공간 차지
    flexDirection: 'column',  // 세로 방향 (기본값)
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center',     // 가로 중앙 정렬
  }
});
```

#### 주요 속성
```javascript
{
  // 크기
  width: 100,
  height: 100,
  
  // 여백
  margin: 10,         // 외부 여백
  padding: 10,        // 내부 여백
  
  // 테두리
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,    // 둥근 모서리
  
  // 배경
  backgroundColor: '#fff',
  
  // 그림자 (iOS)
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  
  // 그림자 (Android)
  elevation: 3,
}
```

---

## 주요 개념 학습

### 1. REST API란?

**REST**: Representational State Transfer

웹에서 데이터를 주고받는 규칙입니다.

#### HTTP 메서드
| 메서드 | 용도 | 예시 |
|--------|------|------|
| GET | 조회 | 알림장 목록 가져오기 |
| POST | 생성 | 새 알림장 등록 |
| PUT | 전체 수정 | 알림장 전체 내용 변경 |
| PATCH | 일부 수정 | 알림장 제목만 변경 |
| DELETE | 삭제 | 알림장 삭제 |

#### HTTP 상태 코드
| 코드 | 의미 | 설명 |
|------|------|------|
| 200 | OK | 성공 |
| 201 | Created | 생성 성공 |
| 400 | Bad Request | 잘못된 요청 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 500 | Internal Server Error | 서버 오류 |

### 2. 비동기 프로그래밍 (async/await)

#### 동기 vs 비동기

**동기 (Synchronous)**
```javascript
console.log('1');
console.log('2');
console.log('3');
// 출력: 1, 2, 3 (순서대로)
```

**비동기 (Asynchronous)**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 1000);
console.log('3');
// 출력: 1, 3, 2 (2는 1초 후에)
```

#### async/await 사용법
```javascript
// async 함수 선언
async function fetchData() {
  // await: 비동기 작업이 완료될 때까지 대기
  const response = await fetch('http://...');
  const data = await response.json();
  return data;
}

// 호출
fetchData().then(data => console.log(data));
```

#### try/catch (에러 처리)
```javascript
async function fetchData() {
  try {
    const response = await fetch('http://...');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('오류:', error);
  }
}
```

### 3. JavaScript ES6+ 문법

#### 화살표 함수
```javascript
// 일반 함수
function add(a, b) {
  return a + b;
}

// 화살표 함수
const add = (a, b) => {
  return a + b;
};

// 간단한 형태 (중괄호 생략)
const add = (a, b) => a + b;
```

#### 구조 분해 할당
```javascript
// 객체
const user = { name: '철수', age: 20 };
const { name, age } = user;
console.log(name);  // '철수'

// 배열
const [first, second] = [1, 2, 3];
console.log(first);  // 1
```

#### 스프레드 연산자
```javascript
// 배열 복사 및 추가
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

// 객체 복사 및 수정
const obj1 = { name: '철수', age: 20 };
const obj2 = { ...obj1, age: 21 };  // { name: '철수', age: 21 }
```

#### 템플릿 리터럴
```javascript
const name = '철수';
const age = 20;

// 일반 문자열
const str1 = '이름: ' + name + ', 나이: ' + age;

// 템플릿 리터럴
const str2 = `이름: ${name}, 나이: ${age}`;
```

---

## 실습 과제

### 초급 과제

#### 1. 알림장 제목 글자 수 제한
선생님 화면에서 제목이 50자를 넘지 못하도록 제한하세요.

**힌트**
```javascript
<TextInput
  maxLength={50}  // 최대 글자 수
  value={title}
  onChangeText={setTitle}
/>
```

#### 2. 로딩 중 버튼 비활성화
알림장 등록 중에는 버튼을 여러 번 클릭할 수 없도록 하세요.

**힌트**: `disabled={loading}` 속성 사용

#### 3. 고객 화면에 알림장 개수 표시
고객 화면 상단에 "총 N개의 알림장"을 표시하세요.

**힌트**
```javascript
<Text>총 {notices.length}개의 알림장</Text>
```

### 중급 과제

#### 4. 알림장 삭제 기능 추가
알림장 상세 화면에서 삭제 버튼을 추가하세요.

**단계**
1. `backend/database.js`에 `deleteNotice` 함수 추가
2. `backend/server.js`에 DELETE API 추가
3. `frontend/store/noticeStore.js`에 `deleteNotice` 액션 추가
4. `frontend/app/notice-detail.js`에 삭제 버튼 추가

**백엔드 예시**
```javascript
// database.js
function deleteNotice(id, callback) {
  const sql = `DELETE FROM notices WHERE id = ?`;
  db.run(sql, [id], callback);
}

// server.js
app.delete('/api/notices/:id', (req, res) => {
  const id = parseInt(req.params.id);
  deleteNotice(id, (err) => {
    if (err) {
      return res.status(500).json({ error: '삭제 실패' });
    }
    res.json({ success: true });
  });
});
```

#### 5. 검색 기능 추가
고객 화면에서 제목으로 알림장을 검색할 수 있도록 하세요.

**힌트**
```javascript
const [searchText, setSearchText] = useState('');

const filteredNotices = notices.filter(notice => 
  notice.title.includes(searchText)
);
```

#### 6. 알림장 수정 기능 추가
등록된 알림장의 제목과 내용을 수정할 수 있도록 하세요.

### 고급 과제

#### 7. 사용자 인증 추가
선생님과 고객을 구분하기 위한 로그인 기능을 추가하세요.

#### 8. 댓글 기능 추가
각 알림장에 고객이 댓글을 달 수 있도록 하세요.

#### 9. 페이지네이션 추가
알림장이 많을 때 10개씩 나눠서 보여주도록 하세요.

---

## 트러블슈팅

### 자주 발생하는 오류

#### 1. Network request failed
**원인**: 백엔드 서버에 연결할 수 없음

**해결 방법**
1. 백엔드 서버가 실행 중인지 확인
2. IP 주소가 정확한지 확인 (`ipconfig` 명령어)
3. 방화벽이 3000 포트를 허용하는지 확인
4. 휴대폰과 컴퓨터가 같은 Wi-Fi에 연결되어 있는지 확인

#### 2. Cannot read property 'map' of undefined
**원인**: 데이터가 아직 로드되지 않음

**해결 방법**
```javascript
// 안전하게 체크
{notices && notices.map(notice => ...)}

// 또는 기본값 사용
const notices = data?.notices || [];
```

#### 3. Image does not display
**원인**: 이미지 URL이 잘못됨

**해결 방법**
```javascript
// 절대 경로 사용
source={{ uri: `http://192.168.219.101:3000${item.image_url}` }}

// 로컬 이미지
source={require('./assets/image.png')}
```

---

## 추가 학습 자료

### 공식 문서
- [React Native 공식 문서](https://reactnative.dev/)
- [Expo 공식 문서](https://docs.expo.dev/)
- [Zustand 공식 문서](https://github.com/pmndrs/zustand)
- [Express 공식 문서](https://expressjs.com/)

### 추천 학습 순서
1. JavaScript ES6+ 기본 문법
2. React 기본 개념 (컴포넌트, Props, State, Hooks)
3. React Native 기본 컴포넌트
4. REST API 개념
5. 상태 관리 (Zustand 또는 Redux)

---

## 프로젝트 확장 아이디어

1. **푸시 알림**: 새 알림장이 등록되면 고객에게 알림
2. **다국어 지원**: 한국어/영어 전환
3. **다크 모드**: 어두운 테마 지원
4. **오프라인 모드**: 인터넷이 없어도 이전 데이터 표시
5. **통계 대시보드**: 월별 알림장 개수, 자주 사용하는 단어 등

---

이 가이드를 통해 React Native의 기본을 학습하고, 실제 동작하는 앱을 만들어보세요! 💪

