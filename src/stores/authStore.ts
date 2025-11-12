import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';
import { createAsyncStorage } from '../utils/storage';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  resetError: () => void;
  incrementExportsToday: () => void;
  resetExportsToday: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement actual authentication logic
          // This is a placeholder for now
          const mockUser: User = {
            id: '1',
            email: credentials.email || 'user@example.com',
            displayName: 'Test User',
            subscriptionTier: 'free',
            exportsToday: 0,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            favorites: [],
            preferences: {
              language: 'en',
              notifications: true,
              theme: 'auto',
            },
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement actual registration logic
          const mockUser: User = {
            id: '1',
            email: data.email,
            displayName: data.displayName,
            subscriptionTier: 'free',
            exportsToday: 0,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            favorites: [],
            preferences: {
              language: 'en',
              notifications: true,
              theme: 'auto',
            },
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      resetError: () => {
        set({ error: null });
      },

      incrementExportsToday: () => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              exportsToday: currentUser.exportsToday + 1,
            },
          });
        }
      },

      resetExportsToday: () => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              exportsToday: 0,
            },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createAsyncStorage(),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
