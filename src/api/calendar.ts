import { apiClient } from './client';

export interface CalendarEventRequest {
  title: string;
  startDate: string; // YYYY-MM-DDTHH:mm:ss
  endDate?: string | null; // YYYY-MM-DDTHH:mm:ss
  memo?: string | null;
}

export interface CalendarEventResponse {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  memo: string | null;
  reportId: number | null;
  color: string;
  
  // 진단 기록 연동 시 반환되는 필드
  majorCategory?: string | null;
  minorCategory?: string | null;
  symptomExpression?: string | null;
  painRange?: string | null;
  painIntensity?: number | null;
  onsetTime?: string | null;
  additionalNotes?: string | null;
  recommendedDepartment?: string | null;
}

/**
 * 캘린더 수동 이벤트 등록
 */
export const createCalendarEvent = async (data: CalendarEventRequest) => {
  const response = await apiClient.post('/api/calendar', data);
  return response.data;
};

/**
 * 월별 캘린더 조회 (이벤트 및 증상카드 한 번에 조회)
 */
export const getCalendarMonthly = async (year: number, month: number) => {
  const response = await apiClient.get('/api/calendar', {
    params: { year, month },
  });
  return response.data;
};

/**
 * 캘린더 이벤트 상세 단건 조회
 */
export const getCalendarEventDetail = async (id: number) => {
  const response = await apiClient.get(`/api/calendar/${id}`);
  return response.data;
};

/**
 * 캘린더 이벤트 수정
 */
export const updateCalendarEvent = async (id: number, data: CalendarEventRequest) => {
  const response = await apiClient.put(`/api/calendar/${id}`, data);
  return response.data;
};

/**
 * 캘린더 이벤트 삭제
 */
export const deleteCalendarEvent = async (id: number) => {
  const response = await apiClient.delete(`/api/calendar/${id}`);
  return response.data;
};
