"use client";
import { MyPayload, Props } from "@/app/exports/exports";
import { jwtDecode } from "jwt-decode";
import React, { useState, ChangeEvent, useEffect } from "react";

export default function EditProfile({ onClose }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File>();
  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setNewImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }
  useEffect(() => {
    const tokenCookies = document.cookie;
    const tokenMatch = tokenCookies
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (tokenMatch) {
      const tokenValue = tokenMatch.split("=")[1];
      const decode = jwtDecode<MyPayload>(tokenValue);
      setName(decode?.name || "");
      setUsername(decode?.username || "");
      setAvatar(decode?.avatar || "");
      setUserId(decode?.id || "");
    }
  }, []);

  async function editProfile() {
    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("username", username || "");
    if (newImage) {
      formData.append("avatar", newImage);
    }

    try {
      const res = await fetch(`https://friendlink-api.onrender.com/user/update/${userId}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();

      document.cookie = `token=${data.data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      };`;

      window.location.pathname = "/myProfile";
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-full h-screen sm:w-[24rem] sm:h-auto bg-[var(--post-background)] p-6 rounded-2xl shadow-xl">
      <button
        onClick={onClose}
        className="flex justify-end w-full cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-center text-zinc-800 dark:text-white mb-6">
        Edit profile
      </h2>
      <div className="flex justify-center gap-3">
        <label className="flex gap-2 items-center text-sm cursor-pointer">
          {preview ? (
            <img src={preview} className="size-24 object-cover  rounded-full" />
          ) : (
            <img
              src={avatar || "null"}
              className="size-24 object-cover  rounded-full"
            />
          )}
          <input type="file" hidden onChange={handleImageChange} />
        </label>
      </div>
      <br />
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
          Name
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name ?? ""}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 bg-[rgba(255,255,255,0.001)] focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={username ?? ""}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="@username"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 bg-[rgba(255,255,255,0.001)] focus:ring-blue-500"
        />
      </div>

      <button
        onClick={editProfile}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all cursor-pointer"
      >
        Save changes
      </button>
    </div>
  );
}
