import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters.")
    .max(100, "Organization name must not exceed 100 characters."),

  description: z.string().trim().max(500, "Description must not exceed 500 characters.").optional(),
});

export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters.")
    .max(100, "Organization name must not exceed 100 characters."),

  description: z.string().trim().max(500, "Description must not exceed 500 characters.").optional(),
});

export type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>;
