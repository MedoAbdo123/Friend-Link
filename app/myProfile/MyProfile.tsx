"use client";
import React, { useState } from "react";
import Post from "../components/posts/Post";
import PostsLoading from "../components/loading/PostsLoading";
import EditProfile from "../components/profile/EditProfile";

function MyProfile({ data }: any) {
  const [myData, setMyData] = useState<{
    user: { avatar: string; name: string; username: string };
    avatar: string;
  }>(data[0]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const user = data;
  const posts: any[] = data;
  const postsJSX =
    posts.length >= 1 ? (
      posts.map((post) => (
        <Post
          key={post._id}
          name={post.user.name}
          username={post.user.username}
          userPhoto={post.user.avatar}
          image={post.image}
          _id={post._id}
          user={post.user}
          commentNumber={post.commentsNumber}
          likedUsers={post.likedUsers}
          likes={post.likes}
          content={post.content}
          timeAgo={post.timeAgo}
          title={post.title}
        />
      ))
    ) : (
      <>
        <PostsLoading />
      </>
    );
  return (
    <article className="w-full min-h-screen">
      <section className="flex flex-col items-center mt-4">
        <img
          src={myData?.user.avatar || user?.avatar}
          alt={myData?.user.name || user?.name}
          className="size-30 rounded-full object-cover"
        />
        <br />
        <p className="text-3xl font-black">{myData?.user.name || user?.name}</p>
        <p className="font-black text-gray-700">
          {myData?.user.username || user?.username}
        </p>
        <div className="flex gap-3 mt-4 items-center">{posts.length} posts</div>
        <button
          onClick={() => setShowEditProfile(true)}
          className="flex gap-2 justify-center items-center bg-[var(--bg-button)] w-70 p-1 rounded cursor-pointer"
        >
          Edit Profile
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 30 30"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      </section>
      <section className="flex flex-col items-center p-3 space-y-7">
        {postsJSX}
      </section>
      {showEditProfile == true && (
        <div className="fixed inset-0 flex items-center justify-center h-screen z-50 bg-black/30">
          <EditProfile onClose={() => setShowEditProfile(false)} postId="" />
        </div>
      )}
    </article>
  );
}

export default MyProfile;
