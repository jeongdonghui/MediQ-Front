import { apiClient } from './client';

export const getAllAdminInquiries = async () => {
  const response = await apiClient.get('/api/admin/inquiries');
  return response.data;
};

export const getAdminInquiryDetail = async (inquiryId: string | number) => {
  const response = await apiClient.get(`/api/admin/inquiries/${inquiryId}`);
  return response.data;
};

export const answerAdminInquiry = async (inquiryId: string | number, data: { answerContent: string }) => {
  const response = await apiClient.post(`/api/admin/inquiries/${inquiryId}/answer`, data);
  return response.data;
};
