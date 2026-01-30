// Types based on backend schema

// User types - matches users table
export type UserRole = "client" | "vendor";

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string; // Not included in responses
  info?: Record<string, unknown>;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserSignupInput {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

// Vendor types - matches vendors table
export interface Question {
  question: string;
  answer: string;
}

export interface VendorDescription {
  question: Question[];
}

export interface Vendor {
  id: number;
  vendorName: string;
  description: string;
  owner: number; // references user.id
  city: string;
  nation: string;
  culture?: string;
  theme?: string;
  space?: string;
  infos?: VendorDescription;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorRegistrationInput {
  vendorName: string;
  description: string;
  city: string;
  nation: string;
  culture?: string;
  theme?: string;
  space?: string;
  categoryId?: number;
  categoryAnswers?: Question[];
}

// Category types - matches category table
export interface CategoryQuestion {
  question: string;
}

export interface Category {
  id: number;
  parentId?: number;
  title: string;
  question: CategoryQuestion[];
  infos?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

// Admin types - matches admins table
export interface Admin {
  id: number;
  email: string;
  password?: string;
  info?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

// Auth state type
export interface AuthState {
  user: User | null;
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isVendor: boolean;
  isGuest: boolean;
  invitedEvents: EventInvitation[];
  loading: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

// Event types - matches event table
export interface Event {
  id: number;
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate: string;
  location?: string;
  organizer?: number;
  budget?: number;
  theme?: string;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Guest types - matches user_event table
export interface Guest {
  id: number;
  userId: number;
  eventId: number;
  role?: string;
  status?: 'pending' | 'accepted' | 'declined';
  user?: User;
  event?: Event;
}

// Invitation/Event notification
export interface EventInvitation {
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  organizerName?: string;
  status: 'pending' | 'accepted' | 'declined';
}
