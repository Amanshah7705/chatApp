import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  status: "",
  error: "",
  message: [],
};

export const chatSliceData = createAsyncThunk(
  "get/chats",
  async (payload: any) => {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    chatMain: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatSliceData.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(chatSliceData.fulfilled, (state, action) => {
        state.status = "success";
        state.message = action.payload;
        state.error = "";
      })
      .addCase(chatSliceData.rejected, (state, action) => {
        state.status = "rejected";
        state.error = "error";
      });
  },
});

export const { chatMain } = chatSlice.actions;

export default chatSlice.reducer;
