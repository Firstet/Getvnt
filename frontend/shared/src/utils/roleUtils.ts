/**
 * Role Formatting Utilities for GETVNT Platform
 */

export type UserRole = 'super_admin' | 'tenant_admin' | 'organizer_owner' | 'organizer_admin' | 'tenant_staff' | 'attendee' | 'client_user' | string;

export function getRoleBadgeLabel(role?: string): string {
  if (!role) return 'TENANT_ADMIN';
  const clean = role.toLowerCase().trim();

  switch (clean) {
    case 'super_admin':
      return 'SUPER_ADMIN';
    case 'tenant_admin':
    case 'organizer_owner':
    case 'organizer_admin':
      return 'TENANT_ADMIN';
    case 'tenant_staff':
      return 'TENANT_STAFF';
    case 'attendee':
    case 'client_user':
    case 'marketplace_user':
      return 'CLIENT_USER';
    default:
      return clean.toUpperCase();
  }
}

export function getRoleDescription(role?: string): string {
  if (!role) return 'Tenant Administrator';
  const clean = role.toLowerCase().trim();

  switch (clean) {
    case 'super_admin':
      return 'Platform Super Admin (Full Governance & System Vault Access)';
    case 'tenant_admin':
    case 'organizer_owner':
    case 'organizer_admin':
      return 'Tenant Admin (Organization Owner & Event Operator)';
    case 'tenant_staff':
      return 'Tenant Staff (Scanner & Event Operator)';
    case 'attendee':
    case 'client_user':
    case 'marketplace_user':
      return 'Client Attendee (Ticket Buyer & Event Discoverer)';
    default:
      return role;
  }
}
