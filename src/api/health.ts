import { apiClient } from './client';

export interface DailyHealthData {
  id?: number;
  recordDate: string; // YYYY-MM-DD
  stepCount: number;
  calories: number;
  distanceMeters: number;
}

/**
 * 일일 건강 기록 저장 (UPSERT)
 */
export const saveDailyHealth = async (data: DailyHealthData) => {
  const response = await apiClient.post('/api/health/daily', data);
  return response.data;
};

/**
 * 특정 일자 건강 기록 조회
 * 파라미터(date) 누락시 기본값으로 서버기준 오늘 날짜가 조회됨
 */
export const getDailyHealth = async (date?: string) => {
  const response = await apiClient.get('/api/health/daily', {
    params: date ? { date } : {},
  });
  return response.data;
};
