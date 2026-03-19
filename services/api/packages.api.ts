// services/api/packages.api.ts
// Packages API Service

import { Package, PackageComparison, PaginatedResponse } from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Packages Endpoints
// ============================================================================

export const packagesApi = {
  /**
   * Get all available packages
   * GET /api/packages/
   */
  getAll: async (): Promise<Package[]> => {
    const response = await apiClient.get<PaginatedResponse<Package> | Package[]>('/packages/');
    return Array.isArray(response) ? response : response.results;
  },

  /**
   * Get package by ID
   * GET /api/packages/{id}/
   */
  getById: async (id: number): Promise<Package> => {
    return apiClient.get<Package>(`/packages/${id}/`);
  },

  /**
   * Get active packages
   * GET /api/packages/active/
   */
  getActive: async (): Promise<Package[]> => {
    return apiClient.get<Package[]>('/packages/active/');
  },

  /**
   * Get featured packages
   * GET /api/packages/featured/
   */
  getFeatured: async (): Promise<Package[]> => {
    const response = await apiClient.get<PaginatedResponse<Package> | Package[]>('/packages/featured/');
    return Array.isArray(response) ? response : response.results;
  },

  /**
   * Get package comparison
   * GET /api/packages/{id}/comparison/
   */
  getComparison: async (id: number): Promise<PackageComparison> => {
    return apiClient.get<PackageComparison>(`/packages/${id}/comparison/`);
  },
};

export default packagesApi;
