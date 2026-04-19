import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import { authService } from '../services/authService';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, goals?: string) => Promise<void>;
  logout: () => void;
}

type Action =
  | { type: 'SET_AUTH'; user: User; token: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; loading: boolean };

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return { user: action.user, token: action.token, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { user: null, token: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
  }
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
  });

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { dispatch({ type: 'LOGOUT' }); return; }
    try {
      const user = await authService.getMe();
      dispatch({ type: 'SET_AUTH', user, token });
    } catch {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => { void bootstrap(); }, [bootstrap]);

  const login = async (email: string, password: string) => {
    const token = await authService.login(email, password);
    localStorage.setItem('token', token);
    const user = await authService.getMe();
    dispatch({ type: 'SET_AUTH', user, token });
  };

  const register = async (name: string, email: string, password: string, role: UserRole, goals?: string) => {
    await authService.register(name, email, password, role, goals);
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
