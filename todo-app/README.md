# 📝 Todo 앱 - React Native 초보자 가이드

React Native를 사용하여 만든 초보자 친화적인 Todo 앱입니다. 이 프로젝트는 React Native의 기본 개념을 학습하기 위한 가이드 앱입니다.

## 🎯 주요 기능

- ✅ 할 일 추가
- ✅ 할 일 완료 표시
- ✅ 할 일 삭제
- ✅ 통계 정보 표시 (전체, 완료, 남은 일)

## 📚 학습 포인트

이 앱을 통해 다음을 학습할 수 있습니다:

1. **React Hooks**
   - `useState`: 컴포넌트 상태 관리
   - 상태 업데이트 방법

2. **컴포넌트 구조**
   - 컴포넌트 분리와 재사용성
   - Props를 통한 데이터 전달
   - 콜백 함수를 통한 이벤트 처리

3. **React Native 기본 컴포넌트**
   - `View`: 레이아웃 컨테이너
   - `Text`: 텍스트 표시
   - `TextInput`: 텍스트 입력
   - `TouchableOpacity`: 터치 가능한 버튼
   - `ScrollView`: 스크롤 가능한 리스트

4. **스타일링**
   - `StyleSheet`: 스타일 정의
   - Flexbox 레이아웃
   - 조건부 스타일링

## 🚀 시작하기

### 필수 요구사항

- Node.js (14 이상)
- npm 또는 yarn
- Expo CLI

### 설치 방법

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **앱 실행**
   ```bash
   npm start
   ```

3. **플랫폼별 실행**
   - iOS 시뮬레이터: `npm run ios`
   - Android 에뮬레이터: `npm run android`
   - 웹 브라우저: `npm run web`

   또는 Expo Go 앱을 사용하여 스마트폰에서 QR 코드를 스캔하여 실행할 수 있습니다.

## 📁 프로젝트 구조

```
todo-app/
├── App.js                 # 메인 App 컴포넌트
├── components/
│   ├── AddTodo.js        # Todo 추가 컴포넌트
│   └── TodoItem.js       # 개별 Todo 항목 컴포넌트
├── package.json          # 프로젝트 의존성
├── app.json             # Expo 설정
└── README.md            # 이 파일
```

## 💡 코드 설명

### App.js
- 앱의 최상위 컴포넌트
- `useState`로 todos 배열 상태 관리
- todo 추가, 삭제, 토글 함수 정의

### components/AddTodo.js
- 새로운 todo를 입력받는 컴포넌트
- `TextInput`과 버튼으로 구성
- 입력값 검증 및 부모 컴포넌트로 데이터 전달

### components/TodoItem.js
- 개별 todo 항목을 표시하는 컴포넌트
- 완료 상태 표시 및 토글 기능
- 삭제 버튼 포함

## 🎨 주요 개념 설명

### useState Hook
```javascript
const [todos, setTodos] = useState([]);
```
- `todos`: 현재 상태 값
- `setTodos`: 상태를 업데이트하는 함수
- `[]`: 초기값 (빈 배열)

### 배열 업데이트
```javascript
// 추가
setTodos([...todos, newTodo]);

// 삭제
setTodos(todos.filter(todo => todo.id !== id));

// 수정
setTodos(todos.map(todo => 
  todo.id === id ? { ...todo, completed: !todo.completed } : todo
));
```

### Props 전달
```javascript
// 부모 컴포넌트에서
<TodoItem todo={todo} onDelete={deleteTodo} onToggle={toggleTodo} />

// 자식 컴포넌트에서
const TodoItem = ({ todo, onDelete, onToggle }) => {
  // ...
}
```

## 🔧 커스터마이징

### 색상 변경
`App.js`, `AddTodo.js`, `TodoItem.js`의 `StyleSheet`에서 색상 값을 수정하세요.

### 기능 추가 아이디어
- 할 일 수정 기능
- 우선순위 설정
- 카테고리 분류
- 로컬 저장소에 데이터 저장 (AsyncStorage)
- 날짜/시간 추가

## 📖 참고 자료

- [React Native 공식 문서](https://reactnative.dev/)
- [Expo 문서](https://docs.expo.dev/)
- [React Hooks 문서](https://react.dev/reference/react)

## 📝 라이선스

이 프로젝트는 학습 목적으로 자유롭게 사용할 수 있습니다.

---

**Happy Coding! 🎉**

