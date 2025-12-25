import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export interface ProfilePayload {
  name: string;
  email: string;
}

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async () => {
    const res = await api.get("/users/me");
    return res.data.user;
  }
);

export const updateProfile = createAsyncThunk<
  { message: string; user: ProfilePayload },
  { name: string }
>("profile/updateProfile", async (data) => {
  const res = await api.put("/users/me", data);
  return res.data;
});

export const changePassword = createAsyncThunk<
  { message: string },
  { currentPassword: string; newPassword: string }
>("profile/changePassword", async (data, { rejectWithValue }) => {
  try {
    const res = await api.put("/users/change-password", data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to change password"
    );
  }
});
