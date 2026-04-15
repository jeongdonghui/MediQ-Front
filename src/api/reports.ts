import { apiClient } from './client';

// 증상 기록을 서버에 전송하는 요청 모델
export interface CreateReportRequest {
  mainSymptom: string;
  painIntensity: number;
  symptomArea: string; // 'LOCALIZED' | 'DIFFUSE' | ... 부위 선택
  symptomDuration: string; // 'TODAY' | 'YESTERDAY' | ...
  additionalSymptom?: string;
}

// 리포트 상세(단건) 정보 응답 모델 (예상)
export interface ReportDetailResponse {
  id: number;
  mainSymptom: string;
  painIntensity: number;
  symptomArea: string;
  symptomDuration: string;
  additionalSymptom?: string;
  aiAnalysisResult?: string; // AI가 분석한 병명 및 상세
  createdAt: string;
}

/**
 * 1. 새 보조 문진 생성 (AI 분석 요청)
 * POST /api/reports
 */
export const createReport = async (data: CreateReportRequest) => {
  const response = await apiClient.post('/api/reports', data);
  return response.data;
};

/**
 * 2. 내 보조 문진 전체 조회
 * GET /api/reports
 */
export const getMyReports = async () => {
  const response = await apiClient.get('/api/reports');
  return response.data;
};

/**
 * 3. 보조 문진 상세 조회
 * GET /api/reports/{reportId}
 */
export const getReportDetail = async (reportId: number): Promise<ReportDetailResponse> => {
  const response = await apiClient.get(`/api/reports/${reportId}`);
  return response.data;
};

/**
 * 4. 보조 문진 삭제
 * DELETE /api/reports/{reportId}
 */
export const deleteReport = async (reportId: number) => {
  const response = await apiClient.delete(`/api/reports/${reportId}`);
  return response.data;
};

/**
 * 5. AI 피드백 제출
 * POST /api/reports/{reportId}/feedback
 */
export const submitAiFeedback = async (reportId: number, feedbackData: any) => {
  const response = await apiClient.post(`/api/reports/${reportId}/feedback`, feedbackData);
  return response.data;
};
