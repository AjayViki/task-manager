export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Category {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  category?: Category | null;
}

export interface TaskForm {
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  categoryId?: number | null;
}
