"use client";
import { FriendProps } from "@/app/exports/exports";
import React from "react";


function Friends({ name, avatar, onClick }: FriendProps) {
  return (
    <article className="p-4" onClick={onClick}>
      <div className="w-full flex items-center p-6 gap-4 transition-all duration-300 hover:bg-gray-700 rounded-2xl cursor-pointer">
        <img src={avatar} className="size-10 object-cover rounded-full" />
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">{name}</h1>
          <p className="text-gray-500 line-clamp-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum,
            itaque?
          </p>
        </div>
      </div>
    </article>
  );
}

export default Friends;
