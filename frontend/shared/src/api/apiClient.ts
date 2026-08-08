/// <reference types="vite/client" />

/**
 * GETVNT Enterprise Unified API Client
 * Consumes single-source-of-truth endpoints across Marketplace, Workspace, and Admin apps.
 */

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // 1. Explicit environment variable override
    const metaEnv = (import.meta as any).env;
    if (metaEnv && metaEnv.VITE_API_URL) {
      return metaEnv.VITE_API_URL;
    }
    
    // 2. Dynamic subdomain resolution for getvnt.com
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    if (host.endsWith('getvnt.com')) {
      return `${protocol}//api.getvnt.com/api/v1`;
    }

    // 3. Fallback relative path for gateway proxy, IP, and preview URLs
    return '/api/v1';
  }
  return '/api/v1';
};

export const getAppUrl = (target: 'marketplace' | 'workspace' | 'admin' | 'api'): string => {
  if (typeof window === 'undefined') return '/';

  const host = window.location.hostname;
  const protocol = window.location.protocol;

  // 1. If running on getvnt.com custom domain
  if (host.endsWith('getvnt.com')) {
    switch (target) {
      case 'workspace':
        return `${protocol}//app.getvnt.com`;
      case 'admin':
        return `${protocol}//admin.getvnt.com`;
      case 'api':
        return `${protocol}//api.getvnt.com`;
      case 'marketplace':
      default:
        return `${protocol}//getvnt.com`;
    }
  }

  // 2. Relative path routing for local gateway, IP address, or preview domains (sslip.io)
  switch (target) {
    case 'workspace':
      return '/workspace/';
    case 'admin':
      return '/admin/';
    case 'api':
      return '/api/v1';
    case 'marketplace':
    default:
      return '/';
  }
};

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  error?: string;
}

export const apiClient = {
  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  },

  async post<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  },

  async put<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  },

  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  },

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const token = typeof window !== 'undefined' ? localStorage.getItem('getvnt_auth_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const json = await response.json();
      return json;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'API request failed.',
      };
    }
  },
};
