import axios from 'axios';

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
};

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: { 'Content-Type': 'application/json' },
});

