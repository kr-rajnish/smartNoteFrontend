import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./services/authSlice";
import notesReducer from "./services/noteSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
});
