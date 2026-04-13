import axios from 'axios';
import { getAccessToken } from '../utils/storage';

// TODO: 서버 호스팅 주소가 확정되면 이 값을 변경하세요.
// 임시로 localhost 또는 로컬 IP를 사용할 수 있습니다.
export const BASE_URL = 'http://10.0.2.2:8080';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 자동 토큰 주입 인터셉터
client.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 에러 (토큰 만료 등) 처리
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 서버 에러 상세 정보
    if (error.response?.status === 401) {
      // 권한 없음, 토큰 만료 등의 처리 (추후 refresh token 로직 필요시 추가)
      console.warn('Unauthorized. Logging out or refreshing token...');
      // await clearTokens();
    }
    return Promise.reject(error);
  }
);

export default client;
