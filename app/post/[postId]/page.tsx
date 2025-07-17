"use client";
import { PropsParams } from "@/app/exports/exports";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

function page({ params }: PropsParams) {
  const router = useRouter();
  const { postId } = use(params);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTitleAndContent() {
      const res = await fetch(
        `https://friend-link-api.vercel.app//post/update/${postId}`,
        {
          method: "PATCH",
        }
      );
      const data = await res.json();
      setTitle(data.data.post.title);
      setContent(data.data.post.content);
    }
    getTitleAndContent();
  }, []);

  async function handleEditPost() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const token = localStorage.getItem("token");
    try {
      await fetch(`https://friend-link-api.vercel.app//post/update/${postId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
    } catch (error) {
      console.log(error);
    }
    router.push("/");
  }

  return (
    <form className="w-full min-h-screen py-5">
      <h1 className="font-bold text-5xl my-10 text-center">Edit Post</h1>
      <section className="flex flex-col items-center gap-10">
        <input
          type="text"
          className="w-[80%] bg-[rgba(255,255,255,0.05)] border border-gray-400 p-3 rounded-2xl"
          dir="auto"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ener your post title"
          style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.4)" }}
        />
        <textarea
          dir="auto"
          placeholder="Start writing your post content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-[80%] min-h-100 bg-[rgba(255,255,255,0.05)] border border-gray-400 p-3 rounded-2xl"
          style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.4)" }}
        />
        <div className="w-[80%] flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              router.push("/");
            }}
            className="bg-gray-900 p-2 text-white rounded cursor-pointer hover:bg-gray-950 transition duration-300"
          >
            Cnsale
          </button>
          <button
            type="button"
            onClick={handleEditPost}
            className="bg-gray-900 p-2 text-white rounded cursor-pointer hover:bg-gray-950 transition duration-300"
          >
            Edit Post
          </button>
        </div>
      </section>
    </form>
  );
}

export default page;
