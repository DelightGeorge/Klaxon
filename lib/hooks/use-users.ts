import { useApi, useMutation } from "./use-api";

export interface StaffMember { id: string; firstName: string; lastName: string; email: string; phone?: string; status: string; lastLoginAt?: string; roles?: { role: { name: string } }[]; }
export interface PendingInvite { id: string; email: string; firstName?: string; expiresAt: string; role?: { name: string }; }
export interface OrgApplication { id: string; name: string; type: string; email: string; contactPerson: string; phone?: string; address?: string; licenseNumber?: string; status: string; createdAt: string; }
export interface Organization { id: string; name: string; type: string; email: string; status: string; _count?: { staff: number }; createdAt: string; }

export function useOrgStaff() { return useApi<StaffMember[]>("/organizations/staff", []); }
export function useStaffInvites() { return useApi<PendingInvite[]>("/organizations/staff/invites", []); }
export function useCurrentUser() {
  return useApi<{ user?: { id: string; email: string; firstName: string; lastName: string; roles: string[]; permissions: string[]; organizationId?: string } }>(
    "/auth/me", {}
  );
}
export function useAdminApplications(status = "PENDING") {
  return useApi<OrgApplication[]>("/admin/applications", [], { status });
}
export function useAdminOrganizations(status?: string) {
  return useApi<Organization[]>("/admin/organizations", [], status ? { status } : undefined);
}
export function useActiveSessions() {
  return useApi<{ sessions?: { id: string; ipAddress: string; deviceType: string; lastActiveAt: string; createdAt: string }[] }>(
    "/auth/sessions", {}
  );
}
export function useInviteStaff() {
  return useMutation<{ email: string; firstName: string; lastName: string; roleName: string }, { message: string }>(
    "post", "/organizations/staff/invite"
  );
}
export function useRevokeInvite() {
  return useMutation<void, { message: string }>("delete", "/organizations/staff/invites/placeholder");
}
export function useReviewApplication() {
  return useMutation<{ status: string; rejectionReason?: string }, { message: string; organizationId?: string }>(
    "patch", "/admin/applications/placeholder/review"
  );
}
export function useSuspendOrganization() {
  return useMutation<void, { message: string }>("patch", "/admin/organizations/placeholder/suspend");
}
export function useRevokeSession() {
  return useMutation<void, { message: string }>("delete", "/auth/sessions/placeholder");
}