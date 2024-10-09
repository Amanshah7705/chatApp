"use client";
import { socket } from "@/helper/socketStart";
import { useAppDispatch } from "@/redux/store/store";
import {  notiSliceData } from "@/ReduxManagement/myPreviousConWindow/myPreviousConvwindow.slice";
import { currentSearchSliceData, searchBarSliceData } from "@/ReduxManagement/SearchBar/searchBar.slice";
import React, { useEffect, useState, useCallback } from "react";

export default function SearchBar() {
  const [searchVal, setSearchVal] = useState("");
  const [debounced, setDebounced] = useState("");
  const dispatch = useAppDispatch();
  const debounce = useCallback((value: string) => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, []);
  useEffect(() => {
    socket.emit("GetFriends", {
      name: debounced,
    });
    dispatch(currentSearchSliceData(debounced))
  }, [debounced]);
  useEffect(() => {
    const cleanup = debounce(searchVal);
    return cleanup;
  }, [searchVal, debounce]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
     setSearchVal(e.target.value);
  };

  useEffect(() => {
    socket.on("getFriendFromServer", async (data: any) => {
      dispatch(searchBarSliceData(data));
      if(debounced.length>0){
         dispatch(notiSliceData(data))
      }
    });
  }, []);

  return (
    <input
      type="text"
      placeholder="Search users..."
      onChange={handleSearch}
      value={searchVal}
      className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
    />
  );
}
