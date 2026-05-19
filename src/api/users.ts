import { apiClient } from './client';

export interface UpdateProfileRequest {
  nickname: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
}

/**
 * 로그인한 유저의 프로필 정보 반환
 * GET /api/users/me
 */
export const getMyProfile = async () => {
  const response = await apiClient.get('/api/users/me');
  return response.data;
};

/**
 * 닉네임 변경
 * PATCH /api/users/me
 */
export const updateMyProfile = async (data: UpdateProfileRequest) => {
  const response = await apiClient.patch('/api/users/me', data);
  return response.data;
};

/**
 * 로그인된 유저의 비밀번호 변경
 * PATCH /api/users/me/password
 */
export const changeMyPassword = async (data: ChangePasswordRequest) => {
  const response = await apiClient.patch('/api/users/me/password', data);
  return response.data;
};

/**
 * 알림 설정 등 환경 설정 관리 조회
 * GET /api/users/me/settings
 */
export const getMySettings = async () => {
  const response = await apiClient.get('/api/users/me/settings');
  return response.data;
};

/**
 * 알림 설정 등 환경 설정 변경
 * PATCH /api/users/me/settings
 */
export const updateMySettings = async (data: any) => {
  const response = await apiClient.patch('/api/users/me/settings', data);
  return response.data;
};

/**
 * 현재 위경도 좌표 저장
 * PUT /api/users/me/location
 */
export const updateMyLocation = async (data: UpdateLocationRequest) => {
  const response = await apiClient.put('/api/users/me/location', data);
  return response.data;
};

/**
 * 계정 삭제 및 탈퇴 기록 저장
 * DELETE /api/users/me
 */
export const withdrawAccount = async () => {
  const response = await apiClient.delete('/api/users/me');
  return response.data;
};
