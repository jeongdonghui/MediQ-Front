// src/api/medicines.ts

import { apiClient } from './client';

export interface MedicineItem {
  rank: number;
  ingredientName: string;
}

export interface OtcMedicineResponse {
  diseaseName: string;
  scenario: string;
  medicines: MedicineItem[];
  caution: string;
}

export const getMedicinesByDisease = async (
  diseaseName: string,
): Promise<OtcMedicineResponse> => {
  const response = await apiClient.get(
    `/api/medicines?diseaseName=${encodeURIComponent(diseaseName)}`,
  );
  return response.data;
};