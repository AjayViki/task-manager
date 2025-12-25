import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { Category } from "../types/category.types";

export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetch",
  async () => {
    const res = await api.get("/categories");
    return res.data;
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (name: string, { rejectWithValue }) => {
    try {
      const res = await api.post("/categories", { name });
      return res.data; // { message, category }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/categories/${id}`);
      return res.data; // { message }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete category"
      );
    }
  }
);
