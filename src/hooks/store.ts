import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/app.reducer";
import authReducer from "./reducers/auth.reducer";
import postReducer from "./reducers/post-reducer";
import userReducer from "./reducers/user.reducer";

export const store = configureStore({
  reducer: {
    app: appReducer,
    post: postReducer,
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
