import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// iOS 시뮬레이터: http://localhost:8080
// Android 에뮬레이터: http://10.0.2.2:8080  ← 실기기 테스트 시 PC IP로 변경
// 실기기 테스트: http://{PC_LOCAL_IP}:8080  (예: http://192.168.0.10:8080)
const BASE_URL = 'http://10.0.2.2:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get access token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 토큰 만료 처리 및 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 401 에러(Unauthorized) 발생 시 && 아직 재시도하지 않은 요청일 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          // 토큰 재발급 API 호출 (/api/auth/reissue)
          const resp = await axios.post(`${BASE_URL}/api/auth/reissue`, { refreshToken });
          const newAccessToken = resp.data?.accessToken; // 명세에 맞게 파싱 구조 변경 필요
          
          if (newAccessToken) {
            await AsyncStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest); // 막혔던 요청 다시 시도
          }
        }
      } catch (reissueError) {
        console.error('Failed to reissue token:', reissueError);
        // 토큰 갱신 실패 시 로그아웃 로직(스토리지 비우기 및 로그인 화면 이동) 등 추가 가능
      }
    }
    
    // ✅ 403 에러(권한 없음) 발생 시 (관리자 전용 API 등)
    if (error.response?.status === 403) {
      Alert.alert('권한 없음', '관리자 권한이 없습니다.');
      // 참고: 전역 네비게이션 ref를 통해 Home으로 튕겨내는 로직 추가 가능
    }
    
    return Promise.reject(error);
  }
);
