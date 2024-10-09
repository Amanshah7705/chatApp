import React, { useEffect, useRef } from "react";
import { Button } from "../button";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store/store";
import { socket } from "@/helper/socketStart";
import { chatSliceData } from "@/ReduxManagement/currentChatWindow/currentChatWindow.slice";
import { format } from "date-fns";

const ChatWindow = () => {
  const dispatch = useAppDispatch();
  const messageRef = useRef(null);
  const scrollRef = useRef(null);

  const friendId = useSelector((state: RootState) => state.friend);
  const user = useSelector((state: RootState) => state.login.user);
  const messages = useSelector((state: RootState) => state.chat.message);
  useEffect(() => {
    socket.on("getChatFromServer", (data) => {
      dispatch(chatSliceData(data));
    });
    socket.emit("GetChats", {
      //@ts-ignore
      sourceId: user.id,
      destinationId: friendId.destinationId,
      groupId: friendId.groupId,
    });
  }, [dispatch, socket]);

  useEffect(() => {
    socket.emit("GetChats", {
      //@ts-ignore
      sourceId: user.id,
      destinationId: friendId.destinationId,
      groupId: friendId.groupId,
    });
    //@ts-ignore
  }, [dispatch, user.id, friendId, socket, messages]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //@ts-ignore
    const newMessage = messageRef.current?.value;
    if (newMessage && newMessage.length > 0) {
      const messageData = {
        //@ts-ignore
        sourceId: user.id,
        destinationId: friendId.destinationId,
        groupId: friendId.groupId,
        text: newMessage,
        createdAt: new Date().toISOString(),
      };

      socket.emit("createChat", messageData);
      socket.emit("myPreviousCon", {
        //@ts-ignore
        sourceId: user.id,
      });
      if (messageRef.current) {
        //@ts-ignore
        messageRef.current.value = "";
      }
    }
  };
  const scrollToBottom = () => {
    if (scrollRef.current) {
      //@ts-ignore
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white shadow-lg rounded-lg">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 &&
          messages.map((message: any) => (
            <div key={message.id} className="p-2 mb-2 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between ">
                <strong className="mr-2 text-blue-600">
                  {message.source.username}
                </strong>
                <span className="text-xs text-gray-500">
                  {format(new Date(message.createdAt), "HH:mm - dd MMMM")}
                </span>
              </div>
              <p className="mt-1">{message.text}</p>
            </div>
          ))}
      </div>
      <form onSubmit={handleSend} className="flex p-2 border-t">
        <input
          type="text"
          ref={messageRef}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type a message..."
        />
        <Button type="submit" className="ml-2">
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
