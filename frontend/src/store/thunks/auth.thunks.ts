import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { User } from "../types/auth.types";

export const registerUser = createAsyncThunk<
  any,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/register", data);

    localStorage.setItem("token", res.data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Register failed");
  }
});

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    await api.post("/auth/login", payload); // cookie set here
    const res = await api.get("/users/me"); // fetch user via cookie
    return res.data.user;
  } catch {
    return rejectWithValue("Invalid credentials");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
});

export const checkAuth = createAsyncThunk<User | null>(
  "auth/checkAuth",
  async () => {
    try {
      const res = await api.get("/user/me");
      return res.data.user;
    } catch {
      return null;
    }
  }
);
