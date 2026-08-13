import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required.").max(150, "Title must not exceed 150 characters."),

  description: z.string().max(2000, "Description must not exceed 2000 characters.").optional(),

  priority: z.string().min(1, "Priority is required."),

  type: z.string().min(1, "Task type is required."),

  assigneeId: z.string().optional(),

  dueDate: z.string().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
