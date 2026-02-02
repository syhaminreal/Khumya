/**
 * Auth Routes Configuration
 * Centralized route constants for easy maintenance and updates
 */

// User Auth Routes
export const USER_ROUTES = {
  LOGIN: '/auth/user-login',
  SIGNUP: '/auth/user-signup',
} as const;

// Vendor Auth Routes
export const VENDOR_ROUTES = {
  LOGIN: '/auth/vendor-login',
  SIGNUP: '/auth/vendor-signup',
} as const;

// Guest Auth Routes
export const GUEST_ROUTES = {
  LOGIN: '/auth/guest-login',
} as const;

// Common Auth Routes
export const AUTH_ROUTES = {
  USER: USER_ROUTES,
  VENDOR: VENDOR_ROUTES,
  GUEST: GUEST_ROUTES,
  CREATE_EVENT: '/auth/createEvent',
} as const;

// Navigation helpers for better type safety
export const NAVIGATION_ROUTES = {
  AUTH: {
    USER_LOGIN: AUTH_ROUTES.USER.LOGIN,
    USER_SIGNUP: AUTH_ROUTES.USER.SIGNUP,
    VENDOR_LOGIN: AUTH_ROUTES.VENDOR.LOGIN,
    VENDOR_SIGNUP: AUTH_ROUTES.VENDOR.SIGNUP,
    GUEST_LOGIN: AUTH_ROUTES.GUEST.LOGIN,
    CREATE_EVENT: AUTH_ROUTES.CREATE_EVENT,
  },
  TABS: {
    HOME: '/(tabs)',
    INDEX: '/(tabs)/index',
    PROFILE: '/(tabs)/profile',
    EXPLORE: '/(tabs)/explore',
  },
} as const;

// Default export for expo-router compatibility
export default function Routes() {
  return null;
}
