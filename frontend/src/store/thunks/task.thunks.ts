import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { Task, TaskForm } from "../types/task.types";

/* ===== Thunks ===== */

// Get all tasks
export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchTasks",
  async () => {
    const res = await api.get("/tasks");
    return res.data;
  }
);

// Get task by ID
export const fetchTaskById = createAsyncThunk<
  Task,
  number,
  { rejectValue: string }
>("tasks/fetchTaskById", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  } catch {
    return rejectWithValue("Failed to load task");
  }
});

// Create task
export const createTask = createAsyncThunk(
  "tasks/create",
  async (data: TaskForm, { rejectWithValue }) => {
    try {
      const res = await api.post("/tasks", data);
      return res.data; // { message, task }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create task"
      );
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }: { id: number; data: TaskForm }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data; // { message, task }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      return res.data; // { message }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete task"
      );
    }
  }
);
