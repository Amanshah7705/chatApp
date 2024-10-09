"use client";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import searchBarReducer from "@/ReduxManagement/SearchBar/searchBar.slice";
import loginReducer from "@/app/Login/login.slice";
import friendReducer from "@/ReduxManagement/myPreviousConWindow/myPreviousConvwindow.slice";
import chatReducer from "@/ReduxManagement/currentChatWindow/currentChatWindow.slice";
export const store = configureStore({
  reducer: {
    searchBar: searchBarReducer,
    login: loginReducer,
    friend: friendReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
