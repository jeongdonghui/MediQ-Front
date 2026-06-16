import { apiClient } from './client';

export const createInquiry = async (formData: FormData) => {
  const response = await apiClient.post('/api/inquiries', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMyInquiries = async () => {
  const response = await apiClient.get('/api/inquiries');
  return response.data;
};

export const getInquiryDetail = async (inquiryId: string | number) => {
  const response = await apiClient.get(`/api/inquiries/${inquiryId}`);
  return response.data;
};
