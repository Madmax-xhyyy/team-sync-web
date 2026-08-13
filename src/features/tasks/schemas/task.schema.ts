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

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required.").max(150, "Title must be 150 characters or less."),

  description: z.string().max(2000, "Description must be 2000 characters or less."),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),

  type: z.enum(["TASK", "BUG", "FEATURE"]),

  dueDate: z.string().optional(),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
