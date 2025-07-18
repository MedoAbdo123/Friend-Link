"use client";
import { Image, Upload } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

function Page() {
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }
  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image || '');
    try {
      const token = localStorage.getItem("token");
      await fetch("https://friendlink-api.onrender.com/post/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      window.location.pathname = "/";
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <form onSubmit={createPost} className="w-full min-h-screen py-5">
      <h1 className="font-bold text-5xl my-10 text-center">Create Post</h1>
      <section className="flex flex-col items-center gap-10">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-[80%] bg-[rgba(255,255,255,0.05)] border border-gray-400 p-3 rounded-2xl"
          dir="auto"
          placeholder="Ener your post title"
          style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.4)" }}
        />
        <textarea
          dir="auto"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your post content..."
          className="w-[80%] min-h-100 bg-[rgba(255,255,255,0.05)] border border-gray-400 p-3 rounded-2xl"
          style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.4)" }}
        />
        <label className="w-full flex justify-center">
          <div
            className="w-[80%] p-4 flex flex-col border border-gray-400 rounded-2xl bg-[rgba(233,233,233,0.1)]"
            style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.4)" }}
          >
            <h1 className="flex items-center gap-2 font-bold text-2xl">
              <span>
                <Image />
              </span>
              Image
            </h1>
            <br />
            <div className="flex justify-center">
              <input
                type="file"
                onChange={handleImageChange}
                hidden
                className="w-[99%] bg-[rgba(255,255,255,0.05)] border-dashed h-70 border-gray-400 p-3 rounded-2xl"
              />
              {preview ? (
                <div className="w-[99%] space-y-4 min-h-70 border-gray-400 p-3 rounded-2xl flex flex-col items-center justify-center">
                  <img
                    src={preview}
                    className="w-auto rounded-2xl object-cover h-100"
                  />
                </div>
              ) : (
                <div className="w-[99%] space-y-4 bg-[rgba(255,255,255,0.05)] border border-dashed h-70 border-gray-400 p-3 rounded-2xl flex flex-col items-center justify-center">
                  <Upload size={80} />
                  <p className="font-bold text-xl">Click to upload an image</p>
                </div>
              )}
            </div>
          </div>
        </label>
        <div className="w-[80%] flex justify-end space-x-3">
          <button className="bg-gray-900 p-2 text-white rounded cursor-pointer hover:bg-gray-950 transition duration-300">
            Cnsale
          </button>
          <button
            type="submit"
            className="bg-gray-900 p-2 text-white rounded cursor-pointer hover:bg-gray-950 transition duration-300"
          >
            Publish Post
          </button>
        </div>
      </section>
    </form>
  );
}

export default Page;
