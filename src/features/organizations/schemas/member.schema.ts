import { z } from "zod";

export const organizationRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER"]);

export const addMemberSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  role: organizationRoleSchema,
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;
