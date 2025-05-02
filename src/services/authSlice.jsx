// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { signupUser, loginUser, getUserData, logoutUser } from "./authThunk";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = { signUp: action.payload };
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = { login: action.payload };
      })

      // Get User Data
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = { getUser: action.payload };
      })

      //Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        // Optionally clear token and user here if not done by the backend
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = { logout: action.payload };
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
