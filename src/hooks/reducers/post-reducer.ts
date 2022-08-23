import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../utils/models/post.model";

interface PostState {
  showPostModal: boolean;
  allPosts: Post[];
  postDetail: Post;
}

const initialState: PostState = {
  showPostModal: false,
  allPosts: [],
  postDetail: null,
};

export const postReducer = createSlice({
  name: "post",
  initialState,
  reducers: {
    openAddPostModal: (state) => {
      state.showPostModal = true;
    },
    closeAddPostModal: (state) => {
      state.showPostModal = false;
    },
    fetchAllPost: (state, posts) => {
      state.allPosts = posts.payload;
    },
    getPostDetail: (state, post) => {
      state.postDetail = post.payload;
    },
  },
});

export const {
  openAddPostModal,
  closeAddPostModal,
  fetchAllPost,
  getPostDetail,
} = postReducer.actions;

export default postReducer.reducer;
