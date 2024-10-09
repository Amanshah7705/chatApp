import { socket } from "@/helper/socketStart";
import { RootState, useAppDispatch } from "@/redux/store/store";
import {
  notiSliceData,
  setFriend,
} from "@/ReduxManagement/myPreviousConWindow/myPreviousConvwindow.slice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Card } from "../card";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Badge } from "../badge";
const FriendList = () => {
  const user = useSelector((state: RootState) => state.login.user);
  const friends = useSelector((state: RootState) => state.friend);
  const searchData = useSelector((state: RootState) => state.searchBar);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (searchData.currentSearch.length == 0) {
      socket.emit("myPreviousCon", {
        //@ts-ignore
        sourceId: user.id,
      });
    }
  }, [user, searchData.currentSearch]);

  useEffect(() => {
    socket.on("myPreviousConQueueServer", (data) => {
      dispatch(notiSliceData(data));
    });
  }, []);

  return (
    <div className="">
      {searchData.currentSearch.length > 0 ? (
        <div>
          {searchData.userId.map((friend: any) => (
            <Card
              key={friend.id}
              className="mb-4 p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              onClick={() =>
                dispatch(
                  setFriend({
                    destinationId: friend.id,
                    groupId: null,
                  })
                )
              }
            >
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold ml-3">
                      {friend.username}
                    </h3>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          {friends.data.map((friend: any) => (
            <Card
              key={friend.id}
              className="mb-4 p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              onClick={() =>
                dispatch(
                  setFriend({
                    destinationId:
                      //@ts-ignore
                      friend.sourceId == user.id
                        ? friend.destinationId
                        : friend.sourceId,
                    groupId: friend.groupId,
                  })
                )
              }
            >
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold ml-3">
                      {friend.groupId
                        ? friend.group.name
                        : //@ts-ignore
                        friend.sourceId == user.id
                        ? friend.destination.username
                        : friend.source.username}
                    </h3>
                    <Badge variant="secondary">
                      {format(new Date(friend.createdAt), "dd/MM/yy")}
                    </Badge>
                  </div>
                  <p className="text-gray-700 ml-3">{friend.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
