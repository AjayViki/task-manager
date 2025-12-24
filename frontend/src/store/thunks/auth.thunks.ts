import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { User } from "../types/auth.types";

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    await api.post("/auth/login", payload); // cookie set here
    const res = await api.get("/user/me"); // fetch user via cookie
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
