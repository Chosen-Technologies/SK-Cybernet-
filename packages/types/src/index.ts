export type UserRole = 'user' | 'admin' | 'super_admin' | 'support';

export type OnboardingStatus = 'incomplete' | 'complete';

export type StudentStatus = 'unverified' | 'pending_review' | 'verified' | 'rejected';

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'cancelled' | 'expired' | 'refunded';

export type TransactionType =
  | 'wallet_funding'
  | 'wallet_escrow_hold'
  | 'wallet_escrow_release'
  | 'credit_conversion'
  | 'coupon_redemption'
  | 'booking_creation'
  | 'booking_refund'
  | 'admin_adjustment'
  | 'dispute_resolution';

export type TransactionDirection = 'in' | 'out';

export type TransactionStatus = 'pending' | 'successful' | 'failed' | 'reversed' | 'disputed';

export type CouponStatus = 'active' | 'expired' | 'voided';

export type DisputeStatus = 'open' | 'under_review' | 'resolved_approved' | 'resolved_rejected' | 'refunded';

export type HubSubscriptionType = 'Daily' | 'Weekly' | 'Monthly';

export interface User {
  id: string;
  email: string;
  phone: string | null;
  fullName: string;
  role: UserRole;
  authProvider: 'google' | 'local';
  onboardingStatus: OnboardingStatus;
  studentStatus: StudentStatus;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}
