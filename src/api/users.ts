import { apiClient } from './client';

export const getMyProfile = async () => {
  const response = await apiClient.get('/api/users/me');
  return response.data;
};

export const updateMyProfile = async (data: { nickname: string }) => {
  const response = await apiClient.patch('/api/users/me', data);
  return response.data;
};

export const changeMyPassword = async (data: any) => {
  const response = await apiClient.patch('/api/users/me/password', data);
  return response.data;
};

export const getMySettings = async () => {
  const response = await apiClient.get('/api/users/me/settings');
  return response.data;
};

export const updateMySettings = async (data: any) => {
  const response = await apiClient.patch('/api/users/me/settings', data);
  return response.data;
};

export const updateMyLocation = async (data: any) => {
  const response = await apiClient.put('/api/users/me/location', data);
  return response.data;
};

export const withdrawAccount = async () => {
  const response = await apiClient.delete('/api/users/me');
  return response.data;
};
