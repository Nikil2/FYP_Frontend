/**
 * Locations API Service
 * CRUD for customer saved addresses
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

export interface SavedLocation {
  id: string;
  userId: string;
  address: string;
  lat: number;
  lng: number;
  label?: string;
  createdAt: string;
}

export interface CreateLocationData {
  address: string;
  lat: number;
  lng: number;
  label?: string;
}

export async function getLocations(): Promise<SavedLocation[]> {
  return apiClient.get<SavedLocation[]>(API_CONFIG.ENDPOINTS.LOCATIONS);
}

export async function createLocation(data: CreateLocationData): Promise<SavedLocation> {
  return apiClient.post<SavedLocation>(API_CONFIG.ENDPOINTS.LOCATIONS, data);
}

export async function updateLocation(locationId: string, data: Partial<CreateLocationData>): Promise<SavedLocation> {
  return apiClient.put<SavedLocation>(API_CONFIG.ENDPOINTS.LOCATIONS_DETAIL(locationId), data);
}

export async function deleteLocation(locationId: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(API_CONFIG.ENDPOINTS.LOCATIONS_DETAIL(locationId));
}

export default {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
};
