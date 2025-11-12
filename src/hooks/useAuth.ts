// Custom hook for authentication operations
import { useAuthStore } from '../stores/authStore';

/**
 * Custom hook for managing authentication
 * Provides easy access to auth store and operations
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  } = useAuthStore();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    updateProfile,

    // Helper functions
    isPremiumUser: user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'enterprise',
    isEnterpriseUser: user?.subscriptionTier === 'enterprise',
    canExport: () => {
      if (!user) return false;
      if (user.subscriptionTier !== 'free') return true;
      // Check daily export limit for free users
      return user.exportsToday < 5;
    },
  };
};

export default useAuth;
