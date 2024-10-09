import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  status: "",
  error: "",
  userId: [],
  currentSearch:"",
};

export const searchBarSliceData = createAsyncThunk(
  "post/GetFriends",
  async (payload: any) => {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
);
export const currentSearchSliceData = createAsyncThunk(
  "post/search",
  async (payload: any) => {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
);

export const searchBarSlice = createSlice({
  name: "searchBar",
  initialState,
  reducers: {
    searchBarMain: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBarSliceData.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(searchBarSliceData.fulfilled, (state, action) => {
        state.status = "success";
        state.userId = action.payload;
        state.error = "";
      })
      .addCase(searchBarSliceData.rejected, (state, action) => {
        state.status = "rejected";
        state.error = "error";
      }).addCase(currentSearchSliceData.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(currentSearchSliceData.fulfilled, (state, action) => {
        state.status = "success";
        state.currentSearch = action.payload;
        state.error = "";
      })
      .addCase(currentSearchSliceData.rejected, (state, action) => {
        state.status = "rejected";
        state.error = "error";
      });
  },
});

export const { searchBarMain } = searchBarSlice.actions;

export default searchBarSlice.reducer;
