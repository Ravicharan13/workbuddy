import React from "react";
import ChatRoom from "../ChatRoom";
import { useRole } from "../../SignUp/auth";
import { ArrowLeft } from "lucide-react";

export default function ChatWindow({ chatRoom, userRole, onBack }) {
  const user = useRole();

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-y dark:text-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-3">
        {/* Mobile back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-black"
          >
            <ArrowLeft />
          </button>
        )}
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

      <div className="flex-1 overflow-hidden">
        <ChatRoom chatRoomId={chatRoom.chatRoomId} user={user} />
      </div>
    </div>
  );
}
