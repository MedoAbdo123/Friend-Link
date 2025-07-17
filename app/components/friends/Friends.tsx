"use client";
import { FriendProps } from "@/app/exports/exports";
import React from "react";

function Friends({
  name,
  avatar,
  onClick,
  lastMessage,
}: FriendProps) {
  return (
    <article className="p-4" onClick={onClick}>
      <div className="w-full p-2 flex items-center pl-6 py-4 gap-4 transition-all duration-300 hover:bg-gray-700 rounded-2xl cursor-pointer">
        <img src={avatar} className="size-10 object-cover rounded-full" />
        <div className="flex flex-col flex-1">
          <h1 className="font-bold text-lg">{name}</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 line-clamp-1">
              {lastMessage}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default Friends;
