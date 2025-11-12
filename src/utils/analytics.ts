// Analytics utility for tracking events
// Based on PRD analytics requirements

import { ANALYTICS_EVENTS } from '../constants';

/**
 * Analytics service
 * Tracks user behavior and app events
 *
 * Note: Integrate with Firebase Analytics or Mixpanel
 */

export class Analytics {
  private static instance: Analytics;

  private constructor() {
    // Initialize analytics services here
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  /**
   * Track an event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (__DEV__) {
      console.log('[Analytics]', eventName, properties);
    }
    // TODO: Implement Firebase Analytics or Mixpanel tracking
    // Example: analytics().logEvent(eventName, properties);
  }

  /**
   * Track screen view
   */
  trackScreen(screenName: string, properties?: Record<string, any>): void {
    this.track('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Track user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    if (__DEV__) {
      console.log('[Analytics] User Properties:', properties);
    }
    // TODO: Implement user property tracking
    // Example: analytics().setUserProperties(properties);
  }

  /**
   * Identify user
   */
  identify(userId: string, traits?: Record<string, any>): void {
    if (__DEV__) {
      console.log('[Analytics] Identify:', userId, traits);
    }
    // TODO: Implement user identification
    // Example: analytics().setUserId(userId);
  }

  // Convenience methods for common events (from PRD)

  trackAppOpened(source: string): void {
    this.track(ANALYTICS_EVENTS.APP_OPENED, { source });
  }

  trackTemplateViewed(templateId: string, category: string, isPremium: boolean): void {
    this.track(ANALYTICS_EVENTS.TEMPLATE_VIEWED, {
      template_id: templateId,
      category,
      is_premium: isPremium,
    });
  }

  trackExportCompleted(format: string, resolution: string, duration: number): void {
    this.track(ANALYTICS_EVENTS.EXPORT_COMPLETED, {
      format,
      resolution,
      duration_seconds: duration,
    });
  }

  trackSubscriptionStarted(plan: string, price: number, paymentMethod: string): void {
    this.track(ANALYTICS_EVENTS.SUBSCRIPTION_STARTED, {
      plan,
      price,
      payment_method: paymentMethod,
    });
  }
}

export const analytics = Analytics.getInstance();
export default analytics;
