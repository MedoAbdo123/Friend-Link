"use client";
import { SendHorizontal, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import CommentsLoading from "../loading/CommentsLoading";
import { useCommentsCache } from "@/app/contexts/CommentsContext";

interface Props {
  onClose: () => void;
  postId: string;
}

function Comments({ onClose, postId }: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { commentsCache, setCommentsCache } = useCommentsCache();
  const [content, setContent] = useState("");
  useEffect(() => {
    if (commentsCache[postId]) {
      setComments(commentsCache[postId]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:3000/comment/${postId}`, {
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postId]);

  const token = localStorage.getItem("token");

  async function addComment() {
    try {
      const res = await fetch("http://localhost:3000/comment", {
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
      console.log("✅ Comment added successfully:", data);
      const newComment = data.comment
      setComments((prev) => [...prev, newComment])
      return data;
    } catch (error) {
      console.error("❌ Error while adding comment: ", error);
      return null;
    }
  }

  return (
    <div className="flex flex-col sm:rounded-2xl h-full w-full sm:w-[600px] sm:h-[630px] bg-[var(--post-background)]">
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Comments</h2>
        <button
          onClick={onClose}
          className="hover:bg-[rgba(255,255,255,0.1)] rounded-full p-1 cursor-pointer transition-all"
        >
          <X />
        </button>
      </header>

      {/* Comments section */}
      <section className="flex-1 comments-app p-4 overflow-y-auto">
        <div className="space-y-4">
          {loading ? (
            <>
              <CommentsLoading />
              <CommentsLoading />
              <CommentsLoading />
            </>
          ) : (
            comments.map((comment) => (
              <header
                key={comment._id}
                className="bg-[var(--background-comment)] px-4 w-full min-h-15 text-[var(--foreground-comment)] rounded"
              >
                <div className="w-full gap-3 pt-2 flex h-full">
                  <div>
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="size-10 min-w-10 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-Roboto font-bold">{comment.user.name}</p>
                    <p className="">{comment.content}</p>
                  </div>
                </div>
              </header>
            ))
          )}
        </div>
      </section>

      {/* TODO INPUT */}
      <section className="p-3 w-full flex gap-1 border-t-1">
        <input
          type="text"
          className="border-1 w-[85%] sm:w-[92%] p-2 rounded"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={addComment}
          className="bg-blue-600 rounded-sm flex-grow flex justify-center items-center cursor-pointer"
        >
          <SendHorizontal />
        </button>
      </section>
    </div>
  );
}

export default Comments;
