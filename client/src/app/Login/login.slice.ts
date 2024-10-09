import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  status: "",
  error: "",
  user: {},
};

export const loginSliceData = createAsyncThunk(
  "post/login",
  async (payload: any) => {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
);

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginMain: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSliceData.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loginSliceData.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        state.error = "";
      })
      .addCase(loginSliceData.rejected, (state, action) => {
        state.status = "rejected";
        state.error = "error";
      });
  },
});

export const { loginMain } = loginSlice.actions;

export default loginSlice.reducer;
