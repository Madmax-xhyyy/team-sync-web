export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskType = "TASK" | "BUG" | "FEATURE";

export interface Task {
  id: string;
  projectId: string;
  columnId: string;

  title: string;
  description: string | null;

  priority: TaskPriority;
  type: TaskType;

  assigneeId: string | null;
  reporterId: string;

  dueDate: string | null;
  position: number;

  createdAt: string;
  updatedAt: string;
}

export interface TaskColumn {
  id: string;
  projectId: string;
  name: string;
  position: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  type: TaskType;
}
