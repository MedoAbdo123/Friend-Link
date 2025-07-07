"use client";
import Link from "next/link";
import React from "react";
import { useState, useRef, useEffect } from "react";
import Comments from "../comment/Comments";
import { PostProps } from "@/app/props/props";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
function Post({
  title,
  content,
  image,
  timeAgo,
  name,
  userPhoto,
  likes,
  commentNumber,
  likedUsers,
  _id,
  username,
}: PostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [localCommentNumber, setLocalCommentNumber] = useState(commentNumber);
  const [like, setLike] = useState({ likes });
  const [isLiked, setIsLiked] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const router = useRouter();

  let userId: string | null = null;
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded: any = jwtDecode(token);
      userId = decoded?.id;
    }

    if (userId && likedUsers?.includes(userId)) {
      setIsLiked(true);
    }
  }, [userId, likedUsers]);

  useEffect(() => {
    function checkTextHeight() {
      if (textRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(textRef.current).lineHeight
        );
        const maxHeight = lineHeight * 10;
        const actualHeight = textRef.current.scrollHeight;

        if (actualHeight > maxHeight) {
          setShowReadMore(true);
        } else {
          setShowReadMore(false);
        }
      }
    }
    checkTextHeight();
    window.addEventListener("resize", checkTextHeight);
    return () => window.removeEventListener("resize", checkTextHeight);
  }, []);

  async function likeAndDisLike(postId: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      setIsLiked(isLiked);
    }
    await fetch(`http://localhost:3000/post/like/${postId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setLike((prev) => ({ ...prev, likes: data.likes })));
    setIsLiked(!isLiked);
  }

  return (
    <article className="flex flex-col text-[var(--post-foreground)] w-auto bg-[var(--post-background)] min-h-auto sm:w-[600px] border-1 rounded-2xl shadow-lg shadow-white post">
      <div className="w-full flex flex-row-reverse items-center justify-between p-4">
        <span className="text-sm">{timeAgo}</span>
        <header className="flex items-center h-12 gap-2">
          <img
            src={userPhoto}
            alt="Medo Abdo profile"
            className="size-10 rounded-full object-cover"
          />
          <Link href={`/profile/${username}`} className="font-bold">
            {name}
          </Link>
          <Link href={`/profile/${username}`} className="text-xs text-gray-600">
            {username}
          </Link>
        </header>
      </div>
      <section className="p-4">
        <h3 className="font-bold text-2xl" dir="auto">
          {title}
        </h3>
        <br />
        <p
          ref={textRef}
          dir="auto"
          className={`leading-relaxed duration-300 text-sm ${
            !isExpanded && showReadMore ? "line-clamp-10 overflow-hidden" : ""
          }`}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: !isExpanded && showReadMore ? 10 : "none",
            WebkitBoxOrient: "vertical",
            overflow: !isExpanded && showReadMore ? "hidden" : "visible",
          }}
        >
          {content}
        </p>

        {showReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </section>
      <section className="p-4">
        <img src={image} className="w-full h-auto object-cover rounded-2xl" />
      </section>
      <section className="w-21 flex">
        <div className="w-full py-2 flex px-5 items-center justify-start">
          <button
            onClick={() => likeAndDisLike(_id)}
            className="text-center hover:bg-[rgba(255,255,255,0.2)] transition-all rounded-full px-1.5 py-1 flex gap-4 hover:cursor-pointer"
          >
            {isLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 fill-red-600 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            ) : (
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            )}
            {like.likes}
          </button>
        </div>
        <div className="w-full py-2 flex px-5 items-center justify-start">
          <button
            onClick={() => setShowComment(true)}
            className="text-center hover:bg-[rgba(255,255,255,0.2)] transition-all rounded-full px-1.5 py-1 flex gap-4 hover:cursor-pointer"
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
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
              />
            </svg>
            {localCommentNumber}
          </button>
        </div>
      </section>

      {showComment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <Comments
            onClose={() => setShowComment(false)}
            postId={_id}
            onCommentChange={(data) =>
              setLocalCommentNumber((prev) => prev + data)
            }
          />
        </div>
      )}
    </article>
  );
}

export default Post;
