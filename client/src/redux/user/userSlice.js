import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      console.log('userSlice - signInStart'); // Debug log
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      console.log('userSlice - signInSuccess with payload:', action.payload); // Debug log
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      console.log('userSlice - Updated state:', state); // Debug log
    },
    signInFailure: (state, action) => {
      console.log('userSlice - signInFailure with payload:', action.payload); // Debug log
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      console.log('userSlice - updateUserStart'); // Debug log
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      console.log('userSlice - updateUserSuccess with payload:', action.payload); // Debug log
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      console.log('userSlice - updateUserFailure with payload:', action.payload); // Debug log
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      console.log('userSlice - deleteUserSuccess'); // Debug log
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      console.log('userSlice - signOutUserSuccess'); // Debug log
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAvatar: (state, action) => {
      if (state.currentUser) {
        state.currentUser.avatar = action.payload;
      }
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  setAvatar,
} = userSlice.actions;
export default userSlice.reducer;
