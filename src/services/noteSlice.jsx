import { createSlice } from "@reduxjs/toolkit";
import { createNote, getNotes, deleteNote, updateNote } from "./noteThunk";

const initialState = {
  notes: [],
  isLoading: false,
  error: null,
  filters: {
    search: "",
    tag: "",
  },
};

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Notes
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Note
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = state.notes.filter((note) => note._id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Note
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        );
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters } = noteSlice.actions;

export default noteSlice.reducer;
