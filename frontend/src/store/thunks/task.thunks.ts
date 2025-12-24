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
export const createTask = createAsyncThunk<
  Task,
  { title: string; priority: string }
>("tasks/createTask", async (payload) => {
  const res = await api.post("/tasks", {
    ...payload,
    status: "Pending",
  });
  return res.data;
});

// Update task
export const updateTask = createAsyncThunk<
  Task,
  { id: number; data: TaskForm }
>("tasks/updateTask", async ({ id, data }) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
});

// Delete task
export const deleteTask = createAsyncThunk<number, number>(
  "tasks/deleteTask",
  async (id) => {
    await api.delete(`/tasks/${id}`);
    return id;
  }
);
