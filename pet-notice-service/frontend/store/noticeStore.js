/**
 * ===== Zustand 상태 관리 스토어 =====
 * 
 * Zustand: Redux보다 간단한 전역 상태 관리 라이브러리
 * - 여러 컴포넌트에서 같은 데이터를 공유할 때 사용
 * - 상태(state)와 액션(action)을 하나의 store에 정의
 */

import { create } from 'zustand';

// 백엔드 API 주소 (실제 컴퓨터의 IP로 변경 필요)
// localhost는 모바일 기기에서 작동하지 않음!
//const API_URL = 'http://localhost:3000/api';
const API_URL = 'http://192.168.219.101:3000/api';

/**
 * Notice Store 생성
 * create() 함수에 (set, get) => ({...}) 형태로 전달
 * - set: 상태를 변경하는 함수
 * - get: 현재 상태를 가져오는 함수
 */
const useNoticeStore = create((set, get) => ({
  // ===== 상태 (State) =====
  notices: [],      // 알림장 목록
  loading: false,   // 로딩 중 여부
  error: null,      // 에러 메시지

  // ===== 액션 (Actions) =====
  
  /**
   * 모든 알림장 가져오기 (GET 요청)
   */
  fetchNotices: async () => {
    // 1. 로딩 시작, 에러 초기화
    set({ loading: true, error: null });
    
    try {
      console.log('API 요청 시작:', `${API_URL}/notices`);
      
      // 2. fetch: 네트워크 요청 (웹 브라우저의 기본 API)
      const response = await fetch(`${API_URL}/notices`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',  // JSON 응답 요청
        },
      });
      
      console.log('응답 상태:', response.status);
      
      // 3. 응답을 JSON으로 파싱
      const data = await response.json();
      console.log('응답 데이터:', data);
      
      // 4. 성공 시 알림장 목록 저장
      if (data.success) {
        set({ notices: data.notices, loading: false });
      } else {
        set({ error: '알림장을 불러오는데 실패했습니다.', loading: false });
      }
    } catch (error) {
      // 5. 에러 처리 (네트워크 오류, 서버 오류 등)
      console.error('알림장 조회 오류:', error);
      console.error('오류 상세:', error.message);
      set({ error: `연결 실패: ${error.message}`, loading: false });
    }
  },

  /**
   * 알림장 생성 (POST 요청)
   * @param {string} title - 제목
   * @param {string} content - 내용
   * @param {string} imageUri - 이미지 URI (선택)
   * @returns {object} { success: boolean, error?: string }
   */
  createNotice: async (title, content, imageUri) => {
    set({ loading: true, error: null });
    
    try {
      console.log('알림장 생성 API 요청:', `${API_URL}/notices`);
      
      // 1. FormData 생성 (파일 업로드를 위한 형식)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      // 2. 이미지가 있으면 FormData에 추가
      if (imageUri) {
        const filename = imageUri.split('/').pop();  // 파일명 추출
        const match = /\.(\w+)$/.exec(filename);  // 확장자 추출
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        // React Native에서 이미지 업로드 형식
        formData.append('image', {
          uri: imageUri,     // 파일 경로
          name: filename,    // 파일명
          type: type,        // MIME 타입
        });
      }

      // 3. POST 요청
      const response = await fetch(`${API_URL}/notices`, {
        method: 'POST',
        body: formData,
        // 주의: Content-Type 헤더를 설정하지 않음
        // React Native에서는 자동으로 multipart/form-data로 설정됨
      });

      console.log('생성 응답 상태:', response.status);
      const data = await response.json();
      console.log('생성 응답 데이터:', data);
      
      // 4. 성공 시 새 알림장을 목록 맨 앞에 추가
      if (data.success) {
        set(state => ({
          notices: [data.notice, ...state.notices],  // 배열 앞에 추가
          loading: false
        }));
        return { success: true };
      } else {
        set({ error: '알림장 생성에 실패했습니다.', loading: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('알림장 생성 오류:', error);
      console.error('오류 상세:', error.message);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
}));

// 다른 컴포넌트에서 사용할 수 있도록 export
export default useNoticeStore;

