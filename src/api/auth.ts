import { apiClient } from './client';

export const login = async (data: any) => {
  const response = await apiClient.post('/api/auth/login', data);
  return response.data;
};

export const kakaoLogin = async (data: any) => {
  const response = await apiClient.post('/api/auth/kakao', data);
  return response.data;
};

export const signup = async (data: any) => {
  const response = await apiClient.post('/api/auth/signup', data);
  return response.data;
};

export const logout = async (data: { refreshToken: string }) => {
  const response = await apiClient.post('/api/auth/logout', data);
  return response.data;
};

export const verifyPasswordAuth = async (data: any) => {
  const response = await apiClient.post('/api/auth/password/verify', data);
  return response.data;
};

export const resetPassword = async (data: any) => {
  const response = await apiClient.post('/api/auth/password/reset', data);
  return response.data;
};

export const findId = async (data: any) => {
  const response = await apiClient.post('/api/auth/find-id', data);
  return response.data;
};
