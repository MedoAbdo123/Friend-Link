"use client";
import { UserMinus, UserPlus } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import Post from "@/app/components/posts/Post";
import UserProfileLoading from "@/app/components/loading/UserProfileLoading";
import PostsLoading from "@/app/components/loading/PostsLoading";
import { PropsParams } from "@/app/exports/exports";
export default function Page({ params }: PropsParams) {
  const { username } = use(params);

  const [sendRequest, setSendRequest] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [addedFriend, setaddedFriend] = useState<{ requestId: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [userData, setUserData] = useState<{
    name?: string;
    username?: string;
    avatar?: string;
    _id?: string;
  }>({});
  const [data, setData] = useState<{
    name?: string;
    username?: string;
    avatar?: string;
    _id?: string;
  }>({});
  useEffect(() => {
    const getTokenFromCookies = () => {
      const cookies = document.cookie.split("; ");
      const found = cookies.find((row) => row.startsWith("token="));
      return found ? found.split("=")[1] : null;
    };
    setToken(getTokenFromCookies());
  }, []);

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await fetch(`http://localhost:3000/post/${username}`, {
          method: "GET",
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);

          setUserData(data[0].user);
        } else {
          setData(data);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      getPosts();
    }
  }, [username]);

  useEffect(() => {
    if (!token || !userData._id) return;

    async function loadStatus() {
      try {
        const res = await fetch(
          `http://localhost:3000/friend/getStatus/${userData._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch status");
        const json = await res.json();
        setaddedFriend([{ requestId: json.status._id }]);
        setStatus(json.status.status);
      } catch (err) {
        console.error(err);
      }
    }
    loadStatus();
  }, [token, userData._id]);

  if (loading) {
    return (
      <div className="flex justify-center w-full">
        <UserProfileLoading />
      </div>
    );
  }

  async function SendRequest(receiverId: string) {
    if (!token) {
      console.error("Token is not ready yet!");
      return;
    }

    const res = await fetch("http://localhost:3000/friend", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ receiverId }),
    });
    const data = await res.json();
    const requestId = data.data.request._id;
    setaddedFriend([{ requestId: requestId }]);
    setSendRequest(!sendRequest);
    setStatus("pending");
  }

  async function DeclineRequest() {
    const found = addedFriend.find((item) => item.requestId);
    const requestId = found?.requestId;
    const res = await fetch(`http://localhost:3000/friend/${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSendRequest(!sendRequest);
    setStatus("none");
  }

  const postsJSX =
    posts.length >= 1 ? (
      posts.map((post) => (
        <Post
          key={post._id}
          name={post.name}
          user={post.user}
          username={post.username}
          userPhoto={post.user.avatar}
          image={post.image}
          _id={post._id}
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
          src={userData.avatar || data.avatar}
          alt={userData.name || data.name}
          className="size-30 rounded-full"
        />
        <br />
        <p className="text-3xl font-black">{userData.name || data.name}</p>
        <p className="font-black text-gray-700">
          {userData.username || userData.username}
        </p>
        <div className="flex gap-3 mt-4 items-center">
          {userData._id &&
            (status !== "pending" ? (
              <button
                onClick={() => SendRequest(userData._id!)}
                className="p-2 min-w-20 rounded border border-[var(--border-color)] cursor-pointer"
              >
                <span className="flex gap-1 items-center">
                  <UserPlus size={15} />
                  <p className="leading-none text-sm font-bold">Send Request</p>
                </span>
              </button>
            ) : status ? (
              <button
                onClick={DeclineRequest}
                className="p-2 min-w-20 rounded border border-[var(--border-color)] cursor-pointer"
              >
                <span className="flex gap-1 items-center">
                  <UserMinus size={15} />
                  <p className="leading-none text-sm font-bold">
                    Cancel Request
                  </p>
                </span>
              </button>
            ) : null)}

          <span>{posts.length} posts</span>
        </div>
      </section>
      <section className="flex flex-col items-center space-y-9 p-6">
        {postsJSX}
      </section>
    </article>
  );
}
