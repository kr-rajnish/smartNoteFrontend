// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  signupUser,
  loginUser,
  getUserData,
  logoutUser,
  checkFirstLoginStatus,
  updateFirstLoginStatus,
} from "./authThunk";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  isAuthenticated: false,
  error: {},
  isFirstLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isFirstLogin = false;
      localStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("isFirstLogin");
    },
    clearErrors: (state) => {
      state.error = null;
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
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isFirstLogin = action.payload.user.isFirstLogin;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = { login: action.payload };
      })

      // Check first login status
      .addCase(checkFirstLoginStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkFirstLoginStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFirstLogin = action.payload.isFirstLogin;
      })
      .addCase(checkFirstLoginStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update first login status
      .addCase(updateFirstLoginStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFirstLoginStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFirstLogin = false; // Set to false as the status is updated
        sessionStorage.setItem("isFirstLogin", "false");
      })
      .addCase(updateFirstLoginStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
