import create from 'zustand';
import axios from 'axios';

// Type definitions for user and auth state. The User type mirrors the
// structure returned by the backend (id, email, role). The AuthState
// holds the current authenticated user and token along with actions to
// log in, register and log out. Actions interact with the API endpoints
// defined on the server (see server/src/routes/auth.routes.ts).

interface User {
  id: string;
  email: string;
  role: 'TEACHER' | 'STUDENT';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'TEACHER' | 'STUDENT') => Promise<void>;
  logout: () => void;
  initialise: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  // Retrieves any existing auth data from localStorage on initialisation.
  initialise: () => {
    const stored = localStorage.getItem('edushare-auth');
    if (stored) {
      const { token, user } = JSON.parse(stored);
      set({ token, user });
    }
  },
  // Logs in by sending credentials to the API. On success stores token and user
  // in state and localStorage.
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('edushare-auth', JSON.stringify({ token, user }));
      set({ token, user, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
    }
  },
  // Registers a new user. On success behaves like login.
  register: async (email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/api/auth/register', { email, password, role });
      const { token, user } = res.data;
      localStorage.setItem('edushare-auth', JSON.stringify({ token, user }));
      set({ token, user, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
    }
  },
  // Clears auth data.
  logout: () => {
    localStorage.removeItem('edushare-auth');
    set({ user: null, token: null });
  },
}));