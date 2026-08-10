import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAppUrl } from '../api/apiClient';

export interface FeatureFlag {
  id: string;
  code: string;
  name: string;
  pivot?: { value: string };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  commission_rate: number;
  price_monthly: number;
  price_annual: number;
  features?: FeatureFlag[];
}

export interface Subscription {
  id: string;
  plan_id?: string;
  tenant_id?: string;
  status: string;
  billing_cycle: string;
  starts_at: string;
  ends_at: string;
  trial_ends_at?: string;
  plan?: SubscriptionPlan;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  settings?: any;
  subscription?: Subscription;
}

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role: 'super_admin' | 'platform_staff' | 'organizer_owner' | 'organizer_staff' | 'attendee';
  tenant_id?: string;
  tenant?: Tenant;
  tenants?: Tenant[];
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isImpersonating: boolean;
  impersonatedOrg: string | null;
  login: (credentials: any) => Promise<any>;
  registerMarketplace: (data: any) => Promise<any>;
  registerOrganizer: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  stopImpersonation: () => void;
  switchOrganization: (tenantId: string) => Promise<void>;
  hasFeature: (flagCode: string) => boolean;
  getFeatureValue: (flagCode: string) => string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialToken = (): { token: string | null; isImp: boolean; org: string | null } => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken && urlToken !== 'undefined' && urlToken !== 'null') {
        localStorage.setItem('getvnt_auth_token', urlToken);
        localStorage.setItem('auth_token', urlToken);
        urlParams.delete('token');
        urlParams.delete('email');
        const newSearch = urlParams.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
        window.history.replaceState({}, '', newUrl);

        return { token: urlToken, isImp: false, org: null };
      }

      const impersonateToken = urlParams.get('impersonate_token');
      if (impersonateToken && impersonateToken !== 'undefined' && impersonateToken !== 'null') {
        const orgName = urlParams.get('org') || 'Organizer Workspace';
        localStorage.setItem('getvnt_auth_token', impersonateToken);
        localStorage.setItem('auth_token', impersonateToken);
        localStorage.setItem('getvnt_impersonating', 'true');
        localStorage.setItem('getvnt_impersonated_org', orgName);

        // Clean URL
        urlParams.delete('impersonate_token');
        urlParams.delete('org');
        const newSearch = urlParams.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
        window.history.replaceState({}, '', newUrl);

        return { token: impersonateToken, isImp: true, org: orgName };
      }
    }
    const t1 = localStorage.getItem('getvnt_auth_token');
    const t2 = localStorage.getItem('auth_token');
    const savedToken = (t1 && t1 !== 'undefined' && t1 !== 'null') ? t1 : (t2 && t2 !== 'undefined' && t2 !== 'null') ? t2 : null;
    const isImp = localStorage.getItem('getvnt_impersonating') === 'true';
    const org = localStorage.getItem('getvnt_impersonated_org');
    return { token: savedToken, isImp, org };
  };

  const initial = getInitialToken();
  const [token, setToken] = useState<string | null>(initial.token);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isImpersonating, setIsImpersonating] = useState<boolean>(initial.isImp);
  const [impersonatedOrg, setImpersonatedOrg] = useState<string | null>(initial.org);

  const getApiBase = () => {
    if (typeof window !== 'undefined') {
      const metaEnv = (import.meta as any).env;
      if (metaEnv && metaEnv.VITE_API_URL) return metaEnv.VITE_API_URL;
      return getAppUrl('api');
    }
    return '/api/v1';
  };

  const API_BASE = getApiBase();

  useEffect(() => {
    if (token && token !== 'undefined' && token !== 'null') {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user || json.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const json = await res.json();
    if (json.success) {
      const tokenVal = json.token || json.data?.token;
      if (tokenVal) {
        setToken(tokenVal);
        localStorage.setItem('getvnt_auth_token', tokenVal);
        localStorage.setItem('auth_token', tokenVal);
      }
      setUser(json.data.user || json.data);
      setIsImpersonating(false);
      setImpersonatedOrg(null);
      localStorage.removeItem('getvnt_impersonating');
      localStorage.removeItem('getvnt_impersonated_org');
    }
    return json;
  };

  const registerMarketplace = async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/register/marketplace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success) {
      const tokenVal = json.token || json.data?.token;
      if (tokenVal) {
        setToken(tokenVal);
        localStorage.setItem('getvnt_auth_token', tokenVal);
        localStorage.setItem('auth_token', tokenVal);
      }
      setUser(json.data.user || json.data);
      setIsImpersonating(false);
    }
    return json;
  };

  const registerOrganizer = async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/register/organizer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success) {
      const tokenVal = json.token || json.data?.token;
      if (tokenVal) {
        setToken(tokenVal);
        localStorage.setItem('getvnt_auth_token', tokenVal);
        localStorage.setItem('auth_token', tokenVal);
      }
      setUser(json.data.user || json.data);
      setIsImpersonating(false);
    }
    return json;
  };

  const logout = async () => {
    if (token && token !== 'undefined') {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
      } catch (err) {}
    }
    setToken(null);
    setUser(null);
    setIsImpersonating(false);
    setImpersonatedOrg(null);
    localStorage.removeItem('getvnt_auth_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('getvnt_token');
    localStorage.removeItem('getvnt_impersonating');
    localStorage.removeItem('getvnt_impersonated_org');
  };

  const stopImpersonation = () => {
    localStorage.removeItem('getvnt_auth_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('getvnt_token');
    localStorage.removeItem('getvnt_impersonating');
    localStorage.removeItem('getvnt_impersonated_org');
    setIsImpersonating(false);
    setImpersonatedOrg(null);
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = getAppUrl('admin'); // Redirect back to Super Admin console
    }
  };

  const switchOrganization = async (tenantId: string) => {
    if (!token) return;
    const res = await fetch(`${API_BASE}/auth/switch-organization`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ tenant_id: tenantId })
    });
    const json = await res.json();
    if (json.success) {
      setUser(json.data);
    }
  };

  const hasFeature = (flagCode: string): boolean => {
    if (user?.role === 'super_admin') return true;
    const features = user?.tenant?.subscription?.plan?.features || [];
    const feat = features.find(f => f.code === flagCode);
    return feat ? feat.pivot?.value === 'true' || feat.pivot?.value !== 'false' : false;
  };

  const getFeatureValue = (flagCode: string): string | null => {
    const features = user?.tenant?.subscription?.plan?.features || [];
    const feat = features.find(f => f.code === flagCode);
    return feat?.pivot?.value || null;
  };

  const refreshUser = async () => {
    if (token) await fetchCurrentUser(token);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, isImpersonating, impersonatedOrg, login, registerMarketplace, registerOrganizer,
      logout, stopImpersonation, switchOrganization, hasFeature, getFeatureValue, refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
