// ─── Account Tier Hierarchy ───────────────────────────────────────────────
// Every account starts as 'user'. Tiers are unlocked progressively.
// user → organizer → trusted_organizer → organizer_pro → platform_staff
export type AccountTier =
  | 'user'               // Attendee: browse & buy tickets
  | 'organizer'          // Can create events (email + phone + bank verified)
  | 'trusted_organizer'  // KYC approved (ID + selfie + bank + admin sign-off)
  | 'organizer_pro'      // Subscription purchased (Website Builder unlocked)
  | 'platform_staff';    // GETVNT team — Platform Control Center access only

// Legacy role types retained for backend compatibility
export type PlatformRole =
  | 'super_admin'
  | 'platform_admin'
  | 'platform_staff'
  | 'technical_support'
  | 'customer_success'
  | 'finance_officer'
  | 'marketing_manager'
  | 'moderator'
  | 'developer'
  | 'auditor';

export type TenantRole =
  | 'organization_owner'
  | 'organization_admin'
  | 'event_manager'
  | 'finance_manager'
  | 'marketing_manager_tenant'
  | 'content_manager'
  | 'ticket_manager'
  | 'scanner_staff'
  | 'volunteer';

export type RoleType = PlatformRole | TenantRole | 'attendee';

export interface User {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: RoleType;
  account_tier: AccountTier;  // New: drives sidebar and feature gating
  tenant_id?: string;
  tenant?: any;
  tenants?: any[];
  created_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
  branding_colors?: {
    primary: string;
    secondary: string;
    dark: string;
  };
  custom_domain?: string;
  is_verified: boolean;
  status: 'active' | 'suspended' | 'trial';
  created_at: string;
}

export interface Event {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  category: string;
  banner_url: string;
  gallery_urls: string[];
  start_date: string;
  end_date: string;
  timezone: string;
  location_type: 'physical' | 'online' | 'hybrid';
  venue_name?: string;
  venue_address?: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  online_link?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_featured: boolean;
  is_trending: boolean;
  ticket_types?: TicketType[];
  organizer?: Tenant;
  created_at: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  type: 'free' | 'paid' | 'vip' | 'donation' | 'early_bird';
  price: number;
  currency: string;
  quantity_available: number;
  quantity_sold: number;
  max_per_order: number;
  sale_start_date?: string;
  sale_end_date?: string;
  is_active: boolean;
}

export interface Order {
  id: string;
  reference: string;
  event_id: string;
  tenant_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subtotal: number;
  fees: number;
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_gateway: 'paystack' | 'flutterwave' | 'stripe' | 'monnify';
  transaction_reference?: string;
  tickets?: Ticket[];
  created_at: string;
}

export interface Ticket {
  id: string;
  order_id: string;
  event_id: string;
  ticket_type_id: string;
  ticket_code: string;
  qr_code_url: string;
  attendee_name: string;
  attendee_email: string;
  is_checked_in: boolean;
  checked_in_at?: string;
  status: 'valid' | 'used' | 'cancelled';
}

export interface Attendee {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  total_orders: number;
  total_spent: number;
  last_attended_at?: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  tenant_id: string;
  name: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'push';
  subject?: string;
  body: string;
  recipient_count: number;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sent_at?: string;
  created_at: string;
}

export interface Payout {
  id: string;
  tenant_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  bank_name: string;
  account_number: string;
  account_name: string;
  processed_at?: string;
}

export interface PlatformMetrics {
  total_tenants: number;
  total_events: number;
  total_tickets_sold: number;
  total_gmv: number;
  platform_revenue: number;
  active_campaigns: number;
}
