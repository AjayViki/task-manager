import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "../thunks/category.thunks";
import { Category } from "../types/category.types";

interface CategoryState {
  list: Category[];
}

const initialState: CategoryState = {
  list: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.list.push(action.payload.category);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
