import { AuthUser } from "../../utils/models/authState.model";
import { createSlice } from "@reduxjs/toolkit";
import { UserBio } from "../../utils/models/post.model";

export interface AuthState {
  authUser: AuthUser | null;
  authUserFullBio: UserBio;
}

const initialState: AuthState = {
  authUser: null,
  authUserFullBio: null,
};

export const authReducer = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuthUser: (state, payload) => {
      state.authUser = payload.payload;
    },
    setAuthUserBio: (state, payload) => {
      state.authUserFullBio = payload.payload;
    },
    updateAuthImage: (state, payload) => {
      state.authUserFullBio.profilePic = payload.payload;
    },
    updateUserBookmark: (state, payload) => {
      state.authUserFullBio.bookmarks = payload.payload;
    },
  },
});

export const {
  setAuthUser,
  setAuthUserBio,
  updateAuthImage,
  updateUserBookmark,
} = authReducer.actions;
export default authReducer.reducer;
