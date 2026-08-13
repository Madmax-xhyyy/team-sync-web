export interface Task {
  id: string;
  projectId: string;
  columnId: string;

  title: string;
  description: string | null;

  priority: string;
  type: string;

  assigneeId: string | null;
  reporterId: string;

  dueDate: string | null;
  position: number;
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
  priority: string;
  type: string;
}
