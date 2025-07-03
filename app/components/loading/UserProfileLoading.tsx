import React from "react";
import PostsLoading from "./PostsLoading";

function UserProfileLoading() {
  return (
    <article className="flex flex-col w-2/2 animate-pulse space-y-10 p-2">
      <section className="w-full flex flex-col justify-center items-center space-y-2">
        <div className="bg-gradient-to-r bg-gray-700 via-gray-700 to-gray-700  rounded-full size-30 p-2"></div>
        <div className="bg-gradient-to-r bg-gray-700 via-gray-700 to-gray-700 rounded w-40 h-5 p-2"></div>
        <div className="bg-gradient-to-r bg-gray-700 via-gray-700 to-gray-700 rounded w-30 h-5 p-2"></div>
        <br />
      </section>
      <div className="space-y-10 flex flex-col items-center">
        <PostsLoading />
        <PostsLoading />
        <PostsLoading />
      </div>
    </article>
  );
}

export default UserProfileLoading;
