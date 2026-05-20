// src/api/medicines.ts

import { apiClient } from './client';

export const getMedicinesByDisease = async (
    diseaseName: string
) => {
    const response = await apiClient.get(
        `/api/medicines?diseaseName=${encodeURIComponent(diseaseName)}`
    );

    return response.data;
};