"use client";

// ===== 真实 API 认证实现 =====
// 调后端 /api/auth/ 系列端点，不再使用 Mock 数据

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: number;
  phone: string;
  country_code: string;
  display_name: string;
  role: string;
  credits: number;
  email?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (phone: string, password: string, code: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  sendCode: (phone: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

async function apiPost(path: string, body: any): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.error || `请求失败 (${res.status})` };
  }
  return { success: true, ...data };
}

async function apiGet(path: string, token: string): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { success: false, error: data.error || `请求失败 (${res.status})` };
  }
  return { success: true, ...(await res.json()) };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 启动时从 localStorage 恢复 token 并验证
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      // 验证 token 并获取用户信息
      apiGet('/auth/me', savedToken).then((res) => {
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          // token 过期或无效，清除
          localStorage.removeItem("token");
          setToken(null);
        }
      }).catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const res = await apiPost('/auth/login', { phone, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("token", res.token);
      return { success: true };
    }
    return { success: false, error: res.error || '登录失败' };
  }, []);

  const register = useCallback(async (phone: string, password: string, code: string, name?: string) => {
    const res = await apiPost('/auth/register', {
      phone, password, code,
      display_name: name || undefined,
    });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("token", res.token);
      return { success: true };
    }
    return { success: false, error: res.error || '注册失败' };
  }, []);

  const sendCode = useCallback(async (phone: string) => {
    const res = await apiPost('/auth/send-code', { phone, country_code: '+86' });
    if (res.success) {
      return { success: true };
    }
    return { success: false, error: res.error || '发送失败' };
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const res = await apiGet('/auth/me', token);
    if (res.success && res.user) {
      setUser(res.user);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        sendCode,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
