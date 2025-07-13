import React from "react";
import ChatRoom from "../ChatRoom";
import {getUser} from "../../SignUp/auth"

export default function ChatWindow({ chatRoom, userRole }) {
  const user = getUser();
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
        <img
          src={chatRoom.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-semibold">{chatRoom.name}</div>
          <div className="text-sm text-gray-500">{chatRoom.location}</div>
        </div>
      </div>
      <div className="flex-1 h-full p-0 overflow-y-auto scroll-smooth bg-gray-50 dark:bg-gray-900">
        <ChatRoom chatRoomId={chatRoom.chatRoomId} user={user} />
      </div>
    </div>
  );
}
