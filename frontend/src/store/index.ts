import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import taskReducer from "../store/slices/task.slice";
import categoryReducer from "./slices/category.slice";
import profileReducer from "./slices/profile.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    categories: categoryReducer,
    profile: profileReducer, // ✅ ADD
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
