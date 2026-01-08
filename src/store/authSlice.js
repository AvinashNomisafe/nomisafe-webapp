/* Auth Slice - Redux State Management */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  userId: null,
  phoneNumber: null,
  isAadhaarVerified: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      return { ...state, ...action.payload };
    },
    setAadhaarVerified: (state, action) => {
      state.isAadhaarVerified = action.payload;
    },
    logout: () => initialState,
  },
});

export const { setAuthState, setAadhaarVerified, logout } = authSlice.actions;
export default authSlice.reducer;
