import { createSlice } from "@reduxjs/toolkit";
import {
  Activity,
  Relation,
  Story,
  UserBio,
} from "./../../utils/models/post.model";

export interface UserState {
  loadingCount: number;
  allUsers: UserBio[];
  userRelations: Relation[];
  userStories: Story[];
  userActivities: Activity[];
  myFollowers: Relation[];
}

const initialState: UserState = {
  loadingCount: 0,
  allUsers: [],
  userRelations: [],
  userStories: [],
  userActivities: [],
  myFollowers: [],
};

export const userReducer = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateLoadingCount: (state, count) => {
      state.loadingCount = count.payload;
    },

    fetchAllUsersExceptAuth: (state, payload) => {
      state.allUsers = payload.payload;
    },

    fetchAllRelations: (state, payload) => {
      state.userRelations = payload.payload;
    },

    UpdateStories: (state, payload) => {
      state.userStories = payload.payload;
    },

    updateUserActivities: (state, activities) => {
      state.userActivities = activities.payload;
    },

    fetchAllMyFollowers: (state, payload) => {
      state.myFollowers = payload.payload;
    },
  },
});

export const {
  updateLoadingCount,
  fetchAllUsersExceptAuth,
  fetchAllRelations,
  UpdateStories,
  updateUserActivities,
  fetchAllMyFollowers,
} = userReducer.actions;
export default userReducer.reducer;
