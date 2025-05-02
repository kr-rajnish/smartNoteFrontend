import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/signup", formData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Check user's first login status
export const checkFirstLoginStatus = createAsyncThunk(
  "auth/checkFirstLoginStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/checkFirstLoginStatus", {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update user's first login status
export const updateFirstLoginStatus = createAsyncThunk(
  "auth/updateFirstLoginStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/updateFirstLoginStatus",
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/login", formData);
      localStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.user.id);
      sessionStorage.setItem("isFirstLogin", response.data.user.isFirstLogin);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// GET USER DATA
export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/user");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/logout");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
