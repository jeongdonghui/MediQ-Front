import { apiClient } from './client';

export interface KakaoLoginRequest {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  password?: string;
  nickname: string;
  phoneNumber: string;
  rrn: string;
  serviceTerms: boolean;
  privacyPolicy: boolean;
  marketing: boolean;
}

export interface TokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword?: string;
  resetToken: string;
}

export interface VerifyPasswordRequest {
  email: string;
  name: string;
  phoneNumber: string;
  rrn: string;
}

export interface FindIdRequest {
  name: string;
  phoneNumber: string;
  rrn: string;
}

/**
 * 이메일/비밀번호 로그인
 * POST /api/auth/login
 */
export const login = async (data: LoginRequest) => {
  const response = await apiClient.post('/api/auth/login', data);
  return response.data;
};

/**
 * 카카오 액세스 토큰으로 로그인/회원가입
 * POST /api/auth/kakao
 */
export const kakaoLogin = async (data: KakaoLoginRequest) => {
  const response = await apiClient.post('/api/auth/kakao', data);
  return response.data;
};

/**
 * 신규 유저 등록
 * POST /api/auth/signup
 */
export const signup = async (data: SignupRequest) => {
  const response = await apiClient.post('/api/auth/signup', data);
  return response.data;
};

/**
 * 리프레시 토큰 삭제 및 세션 종료
 * POST /api/auth/logout
 */
export const logout = async (data: TokenRequest) => {
  const response = await apiClient.post('/api/auth/logout', data);
  return response.data;
};

/**
 * 본인인증(정보 일치 확인) 후 재설정 토큰 발급
 * POST /api/auth/password/verify
 */
export const verifyPasswordAuth = async (data: VerifyPasswordRequest) => {
  const response = await apiClient.post('/api/auth/password/verify', data);
  return response.data;
};

/**
 * 발급받은 토큰으로 비밀번호 재설정
 * POST /api/auth/password/reset
 */
export const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await apiClient.post('/api/auth/password/reset', data);
  return response.data;
};

/**
 * 이름/전화번호/주민번호로 이메일 찾기 (마스킹 처리)
 * POST /api/auth/find-id
 */
export const findId = async (data: FindIdRequest) => {
  const response = await apiClient.post('/api/auth/find-id', data);
  return response.data;
};

/**
 * Refresh Token으로 Access Token 갱신
 * POST /api/auth/reissue
 */
export const reissueToken = async (data: TokenRequest) => {
  const response = await apiClient.post('/api/auth/reissue', data);
  return response.data;
};
