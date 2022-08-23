import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  processing: boolean;
  loadingMessage: string;
  postDetailSidebar: boolean;
  userProfileUpdateSidebar: boolean;
  userStoryDialog: boolean;
  chatBoxDialog: boolean;
}

const initialState: AppState = {
  processing: false,
  loadingMessage: "",
  postDetailSidebar: false,
  userProfileUpdateSidebar: false,
  userStoryDialog: false,
  chatBoxDialog: true,
};

const appReducer = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    startLoadingProcessing: (state) => {
      state.processing = true;
    },

    stopLoadingProcessing: (state) => {
      state.processing = false;
    },

    openPostSidebar: (state) => {
      state.postDetailSidebar = true;
    },

    closePostSidebar: (state) => {
      state.postDetailSidebar = false;
    },

    openProfileUpdate: (state) => {
      state.userProfileUpdateSidebar = true;
    },

    closeProfileUpdate: (state) => {
      state.userProfileUpdateSidebar = false;
    },

    setLoadingMessage: (state, message) => {
      state.loadingMessage = message.payload;
    },

    toggleUserStoryDialog: (state, status) => {
      state.userStoryDialog = status.payload;
    },

    toggleChatBox: (state, status) => {
      state.chatBoxDialog = status.payload;
    },
  },
});

export const {
  startLoadingProcessing,
  stopLoadingProcessing,
  openPostSidebar,
  closePostSidebar,
  openProfileUpdate,
  closeProfileUpdate,
  setLoadingMessage,
  toggleUserStoryDialog,
  toggleChatBox,
} = appReducer.actions;
export default appReducer.reducer;
