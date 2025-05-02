import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/createNote", noteData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// export const getNotes = createAsyncThunk(
//   "notes/getNotes",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get("/getNotes", {
//         withCredentials: true,
//       });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
export const getNotes = createAsyncThunk(
  "notes/getNotes",
  async ({ search = "", tag = "" } = {}, { rejectWithValue }) => {
    try {
      console.log("Thunk params:", { search, tag });
      const params = {};

      // Only add parameters that have values
      if (search) params.search = search;
      if (tag) params.tag = tag;

      const response = await axiosInstance.get("/getNotes", {
        params,
        withCredentials: true,
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/deleteNote/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, updatedData }, { rejectWithValue }) => {
    console.log("updatedData", updatedData);
    console.log("id", id);
    try {
      const response = await axiosInstance.put(
        `/updateNote/${id}`,
        updatedData,
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
