/**
 * Role Formatting Utilities for GETVNT Platform
 */

export type V3Role = 'super_admin' | 'user' | 'organizer' | 'trusted_organizer' | 'organizer_pro';
export type UserRole = V3Role | 'tenant_admin' | 'organizer_owner' | 'organizer_staff' | 'attendee' | string;

export function getRoleBadgeLabel(role?: string): string {
  if (!role) return 'USER';
  const clean = role.toLowerCase().trim();

  switch (clean) {
    case 'super_admin':
    case 'platform_staff':
      return 'SUPER_ADMIN';
    case 'organizer_pro':
      return 'ORGANIZER_PRO';
    case 'trusted_organizer':
      return 'TRUSTED_ORGANIZER';
    case 'organizer':
    case 'organizer_owner':
    case 'organizer_admin':
      return 'ORGANIZER';
    case 'user':
    case 'attendee':
    case 'client_user':
    case 'marketplace_user':
    default:
      return 'USER';
  }
}

export function getRoleDescription(role?: string): string {
  if (!role) return 'User Account';
  const clean = role.toLowerCase().trim();

  switch (clean) {
    case 'super_admin':
    case 'platform_staff':
      return 'Super Admin Operator (Full Platform Governance & Infrastructure Vault)';
    case 'organizer_pro':
      return 'Organizer Pro (Enterprise Subscriber with Website Builder & Custom Domains)';
    case 'trusted_organizer':
      return 'Trusted Organizer (KYC Verified Creator with Marketing & AI Studio)';
    case 'organizer':
    case 'organizer_owner':
    case 'organizer_admin':
      return 'Organizer (Event Creator & Ticket Seller)';
    case 'user':
    case 'attendee':
    case 'client_user':
    case 'marketplace_user':
    default:
      return 'User (Event Discoverer & Ticket Buyer)';
  }
}
