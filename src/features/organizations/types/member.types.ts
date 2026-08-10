export type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER" | "GUEST";

export interface OrganizationMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: OrganizationRole;
}
