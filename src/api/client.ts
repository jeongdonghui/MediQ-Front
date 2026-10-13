import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// 환경변수가 있다면 연결하고, 없다면 임시 백엔드 주소로 설정합니다.
const BASE_URL = 'http://43.200.51.223:8080';


export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEYS = ['accessToken', 'refreshToken', 'ACCESS_TOKEN', 'REFRESH_TOKEN'];

const clearStoredSession = async () => {
  await Promise.all(TOKEN_KEYS.map(key => AsyncStorage.removeItem(key)));
};

const readTokenFromResponse = (data: any, key: 'accessToken' | 'refreshToken') => {
  return data?.[key] ?? data?.data?.[key] ?? data?.result?.[key] ?? null;
};

const isAuthEndpoint = (url?: string) => {
  return !!url && url.startsWith('/api/auth/');
};

// Request Interceptor: 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token && !isAuthEndpoint(config.url)) {
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
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint(originalRequest.url)) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          // 토큰 재발급 API 호출 (/api/auth/reissue)
          const resp = await axios.post(`${BASE_URL}/api/auth/reissue`, { refreshToken }, { timeout: 10000 });
          const newAccessToken = readTokenFromResponse(resp.data, 'accessToken');
          const newRefreshToken = readTokenFromResponse(resp.data, 'refreshToken');
          
          if (newAccessToken) {
            await AsyncStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
              await AsyncStorage.setItem('refreshToken', newRefreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest); // 막혔던 요청 다시 시도
          }
        }
        await clearStoredSession();
      } catch (reissueError) {
        console.error('Failed to reissue token:', reissueError);
        await clearStoredSession();
      }

      error.isAuthExpired = true;
    }
    
    // ✅ 403 에러(권한 없음) 발생 시 (관리자 전용 API 등)
    if (error.response?.status === 403) {
      Alert.alert('권한 없음', '관리자 권한이 없습니다.');
      // 참고: 전역 네비게이션 ref를 통해 Home으로 튕겨내는 로직 추가 가능
    }
    
    return Promise.reject(error);
  }
);
