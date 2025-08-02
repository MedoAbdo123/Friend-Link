"use client";
import Link from "next/link";
import React from "react";
import { useState, useRef, useEffect } from "react";
import Comments from "../comment/Comments";
import { MyPayload, PostProps } from "@/app/exports/exports";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import AlertMessage from "../aletMessage/AlertMessage";
import NextImage from "next/image";
function Post({
  title,
  content,
  image,
  timeAgo,
  userPhoto,
  likes,
  commentsNumber,
  likedUsers,
  _id,
  user,
}: PostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [localCommentNumber, setLocalCommentNumber] = useState(commentsNumber);
  const [like, setLike] = useState({ likes });
  const [isLiked, setIsLiked] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const router = useRouter();
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [decoded, setDecoded] = useState<MyPayload | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded: MyPayload = jwtDecode(token);
      setDecoded(decoded);
      setUserId(decoded?.id);
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

  useEffect(() => {
    function handleOutsideClick() {
      setContextMenuVisible(false);
    }

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  async function handleDeletePost(postId: string) {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/post/delete/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setShowAlert(false);
    window.location.reload();
  }

  return (
    <article className="flex flex-col text-[var(--post-foreground)] w-auto bg-[var(--post-background)] min-h-auto sm:w-[600px] border-1 rounded-2xl shadow-lg shadow-white post">
      <div className="w-full flex flex-row-reverse items-center justify-between p-4">
        <div className="w-full flex flex-col items-end">
          {user && userId == user._id && (
            <div className="text-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();

                  setContextMenuVisible(true);
                  setContextMenuPosition({
                    x: rect.left + window.scrollX,
                    y: rect.bottom + window.scrollY,
                  });
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </div>
          )}

          {contextMenuVisible && (
            <div
              className="absolute bg-gray-800 text-white rounded shadow-md z-50"
              style={{
                position: "absolute",
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
              }}
              onClick={() => setContextMenuVisible(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenuVisible(false);
                  router.push(`/post/${_id}`);
                }}
                className="px-4 py-2 w-full text-left hover:bg-gray-700 flex items-center gap-2"
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
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenuVisible(false);
                  setShowAlert(true);
                }}
                className="px-4 py-2 w-full text-left hover:bg-gray-700 flex items-center gap-2"
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
                </svg>{" "}
                Delete
              </button>
            </div>
          )}
          <span className="text-sm">{timeAgo}</span>
        </div>
        <header className="flex items-center h-12 gap-2">
          <NextImage
            src={userPhoto}
            alt="user profile"
            unoptimized
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
          <Link
            href={
              decoded?.username == user.username
                ? "/myProfile"
                : `/profile/${user.username}`
            }
            className="font-bold text-nowrap"
          >
            {user.name}
          </Link>
          <Link
            href={
              decoded?.username == user.username
                ? "/myProfile"
                : `/profile/${user.username}`
            }
            className="text-xs text-gray-600"
          >
            {user.username}
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
        {image && (
          <NextImage
            width={600}
            height={400}
            alt="post image"
            src={image}
            unoptimized
            className="w-full h-auto object-cover rounded-2xl"
          />
        )}
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

      {showAlert == true && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <AlertMessage
            no={() => setShowAlert(false)}
            yes={() => handleDeletePost(_id || "")}
            text="Do you really want to delete the post?"
          />
        </div>
      )}

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
