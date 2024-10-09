import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  status: "",
  error: "",
  data: [],
  destinationId: "",
  groupId: "",
};

export const notiSliceData = createAsyncThunk(
  "post/myPrevious",
  async (payload: any) => {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
);
export const setFriend = createAsyncThunk(
  "get/friend",
  async (payload: any) => {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
);
export const notiSlice = createSlice({
  name: "noti",
  initialState,
  reducers: {
    notiMain: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(notiSliceData.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(notiSliceData.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
        state.error = "";
      })
      .addCase(notiSliceData.rejected, (state) => {
        state.status = "rejected";
        state.error = "error";
      })
      .addCase(setFriend.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(setFriend.fulfilled, (state, action) => {
        state.status = "success";
        state.destinationId = action.payload.destinationId;
        state.groupId = action.payload.groupId;
        state.error = "";
      })
      .addCase(setFriend.rejected, (state) => {
        state.status = "rejected";
        state.error = "error";
      });
  },
});

export const { notiMain } = notiSlice.actions;

export default notiSlice.reducer;
