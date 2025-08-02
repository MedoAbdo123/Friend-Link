"use client";
import React, { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useCommentsCache } from "@/app/contexts/CommentsContext";
import { jwtDecode } from "jwt-decode";
import {
  CommentType,
  MyPayload,
  Props,
  PropsComment,
} from "@/app/exports/exports";
import AlertMessage from "../aletMessage/AlertMessage";
import NextImage from "next/image";
export default function Comments({ onClose, postId, onCommentChange }: Props) {
  const [comments, setComments] = useState<PropsComment[]>([]);
  const { commentsCache, setCommentsCache } = useCommentsCache();
  const [content, setContent] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [decode, setDecode] = useState<{ id?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode: MyPayload = jwtDecode(token);
      setDecode(decode);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSelectedCommentId(null);
      }
    }
    if (selectedCommentId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCommentId]);

  useEffect(() => {
    if (commentsCache[postId]) {
      setComments(commentsCache[postId]);
      return;
    }

    fetch(`https://friendlink-api.onrender.com/comment/${postId}`, {
      method: "GET",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        const fetchedComments = data.data?.comments || [];
        setComments(fetchedComments);
        setCommentsCache((prev) => ({
          ...prev,
          [postId]: fetchedComments,
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [postId]);

  async function addComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://friendlink-api.onrender.com/comment", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ content, postId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An unexpected error occurred");
      }

      const data = await res.json();
      const newComment = data.comment;
      setComments((prev) => [newComment, ...prev]);
      setCommentsCache((prev) => ({
        ...prev,
        [postId]: [newComment, ...(prev[postId] || [])],
      }));
      onCommentChange?.(1);
      setContent("");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function editComment(commentId: string, newContent: string) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://friendlink-api.onrender.com/comment/${commentId}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            content: newContent,
            commentId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("فشل تعديل التعليق");
      }

      const data = await res.json();
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, ...data.comment } : comment
        )
      );

      setCommentsCache((prev) => ({
        ...prev,
        [postId]:
          prev[postId]?.map((comment) =>
            comment._id === commentId
              ? { ...comment, ...data.comment }
              : comment
          ) || [],
      }));

      return data;
    } catch (error) {
      console.error("Edit error:", error);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content.trim()) return;

    if (editingCommentId) {
      const result = await editComment(editingCommentId, content);
      if (result) {
        setEditingCommentId(null);
        setContent("");
      }
    } else {
      await addComment(e);
    }
  }

  function startEditing(comment: CommentType) {
    setEditingCommentId(comment._id);
    setContent(comment.content);
    setSelectedCommentId(null);
  }

  function cancelEditing() {
    setEditingCommentId(null);
    setContent("");
  }

  async function deleteComment(commentId: string) {
    const token = localStorage.getItem("token");
    await fetch(`https://friendlink-api.onrender.com/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    setComments((prev) => prev.filter((c) => c._id !== commentId));

    setCommentsCache((prev) => ({
      ...prev,
      [postId]: prev[postId]?.filter((c) => c._id !== commentId) || [],
    }));
    onCommentChange?.(-1);
    setShowAlert(false);
  }

  return (
    <div className="sm:rounded-2xl p-6 shadow-xl w-full h-screen sm:w-150 sm:h-160 flex flex-col gap-4 border bg-[var(--app-comments)] text-[var(--app-comments-color)]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold">
          Comments
        </h2>
        <button onClick={onClose} className="px-4 py-1.5 cursor-pointer">
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
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 comments-app">
        {comments.length === 0 ? (
          <p className="text-center">No comments yet.</p>
        ) : (
          <div className="flex flex-col space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className={`rounded-xl p-4 bg-[var(--background-comment)] transition hover:scale-[0.99] hover:shadow-lg duration-200 border ${
                  editingCommentId === comment._id ? "ring-2 ring-blue-500" : ""
                }`}
                style={{
                  boxShadow: "var(--app-comments-shadow) 0px 0px .3rem",
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <NextImage
                      width={40}
                      height={40}
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="size-10 object-cover rounded-full border shadow"
                      style={{ borderColor: "var(--background-comment)" }}
                    />
                    <span className="font-semibold text-base">
                      {comment.user.name}
                    </span>
                  </div>
                  {decode?.id == comment.user._id ? (
                    <div className="flex relative">
                      <svg
                        onClick={() =>
                          setSelectedCommentId(
                            selectedCommentId === comment._id
                              ? null
                              : comment._id
                          )
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                        />
                      </svg>

                      {selectedCommentId === comment._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 bg-gray-700 text-white rounded-lg shadow-lg text-sm w-32 z-10"
                        >
                          <button
                            type="button"
                            onClick={() => startEditing(comment)}
                            className="w-full flex h-full items-center gap-1 text-left px-4 py-2 hover:bg-gray-800 cursor-pointer rounded-t"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="size-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAlert(true);
                              setCommentId(comment._id);
                            }}
                            className="w-full text-left px-4 flex py-2 hover:bg-gray-800 cursor-pointer rounded-b"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-4 mr-1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                            delete
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <p className="break-words text-[15px]" dir="auto">
                  {comment.content}
                </p>
                <p className="text-gray-600 text-xs">{comment.edited}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full flex gap-2">
        <input
          type="text"
          dir="auto"
          className="border-1 w-[85%] sm:w-[92%] p-2 rounded"
          placeholder={
            editingCommentId ? "Edit comment..." : "Write a comment..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-1">
          {editingCommentId && (
            <button
              type="button"
              onClick={cancelEditing}
              className="bg-gray-500 text-white px-3 py-2 rounded-sm cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded-sm flex justify-center items-center cursor-pointer"
          >
            <SendHorizontal />
          </button>
        </div>
      </form>

      {showAlert == true && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <AlertMessage
            no={() => setShowAlert(false)}
            yes={() => deleteComment(commentId)}
            text="Do you really want to delete the comment?"
          />
        </div>
      )}
    </div>
  );
}
