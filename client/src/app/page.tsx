"use client";

import ChatWindow from "@/components/ui/HomeBox/ChatWindow";
import FriendList from "@/components/ui/HomeBox/FriendList";
import SearchBar from "@/components/ui/HomeBox/searchbar";
import { RootState, useAppDispatch } from "@/redux/store/store";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { loginSliceData } from "./Login/login.slice";
import { useSelector } from "react-redux";

export default function Home() {
  const dispatch = useAppDispatch();
  const seletectedOrNot = useSelector((state: RootState) => state.friend);
  async function getss() {
    const session = await getSession();
    if (session) dispatch(loginSliceData(session.user));
  }
  useEffect(() => {
    getss();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <SearchBar />
        <FriendList />
      </div>
      <div className="w-3/4 p-4">
        {seletectedOrNot.destinationId || seletectedOrNot.groupId ? (
          <ChatWindow />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a friend to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
