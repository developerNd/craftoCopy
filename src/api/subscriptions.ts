// Subscription API endpoints
import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api';

export interface SubscriptionData {
  plan: 'premium' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  paymentMethod: string;
}

/**
 * Subscription API
 * Handles all subscription-related API calls
 */
export const SubscriptionAPI = {
  /**
   * Create new subscription
   */
  createSubscription: async (data: SubscriptionData) => {
    return apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS, data);
  },

  /**
   * Get subscription status
   */
  getSubscriptionStatus: async () => {
    return apiClient.get(API_ENDPOINTS.SUBSCRIPTION_STATUS);
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (reason?: string) => {
    return apiClient.post(API_ENDPOINTS.SUBSCRIPTION_CANCEL, { reason });
  },

  /**
   * Update payment method
   */
  updatePaymentMethod: async (paymentMethod: string) => {
    return apiClient.put(`${API_ENDPOINTS.SUBSCRIPTIONS}/payment-method`, { paymentMethod });
  },
};

export default SubscriptionAPI;
