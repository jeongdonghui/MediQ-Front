import client from './client';

/**
 * 로그인 이메일, 패스워드 인터페이스 (서버 명세 기준)
 */
export const login = async (data: Record<string, string>) => {
  // data = { email, password }
  const response = await client.post('/api/auth/login', data);
  return response.data;
};

/**
 * 카카오 로그인/회원가입
 */
export const loginWithKakao = async (accessToken: string) => {
  const response = await client.post('/api/auth/kakao', { accessToken });
  return response.data;
};

/**
 * 회원가입
 */
export const signup = async (data: Record<string, any>) => {
  // data = { email, name, password, nickname, phoneNumber, rrn, serviceTerms, privacyPolicy, marketing }
  const response = await client.post('/api/auth/signup', data);
  return response.data;
};

/**
 * 이메일(아이디) 찾기
 */
export const findId = async (data: Record<string, string>) => {
  // data = { name, phoneNumber, rrn }
  const response = await client.post('/api/auth/find-id', data);
  return response.data;
};

/**
 * 비밀번호 찾기 (본인인증)
 */
export const verifyPassword = async (data: Record<string, string>) => {
  // data = { email, name, phoneNumber, rrn }
  const response = await client.post('/api/auth/password/verify', data);
  return response.data;
};



/**
 * 토큰 재발급
 */
export const reissueToken = async (refreshToken: string) => {
  const response = await client.post('/api/auth/reissue', { refreshToken });
  return response.data;
};
