import { z } from "zod";

export const addMemberSchema = z.object({
  email: z.email("Enter a valid email address."),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "GUEST"]),
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;
