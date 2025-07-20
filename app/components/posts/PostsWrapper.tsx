"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Post from "./Post";
import { PostProps } from "@/app/exports/exports";
import PostsLoading from "../loading/PostsLoading";

interface PostsWrapperProps {
  initialPosts: PostProps[];
}

export default function PostsWrapper({ initialPosts }: PostsWrapperProps) {
  const [posts, setPosts] = useState<PostProps[]>(initialPosts);
  const [skip, setSkip] = useState<number>(initialPosts.length);
  const [loading, setLoading] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);
  const limit = 10;

  useEffect(() => {
    if (!observerRef.current) return;

    observerInstance.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading) {
          loadMore();
        }
      },
      {
        rootMargin: "100px",
      }
    );
    observerInstance.current.observe(observerRef.current);

    return () => {
      if (observerInstance.current && observerRef.current) {
        observerInstance.current.unobserve(observerRef.current);
      }
    };
  }, [loading, skip]);

  async function loadMore() {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://friendlink-api.onrender.com/post/allPosts?skip=${skip}&limit=${limit}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        setPosts((prev) => [...prev, ...data.data]);
        setSkip((prev) => prev + data.data.length);
      } else {
        if (observerInstance.current && observerRef.current) {
          observerInstance.current.unobserve(observerRef.current);
        }
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {posts.map((post) => (
        <Post
          key={post._id}
          _id={post._id}
          title={post.title}
          content={post.content}
          image={post.image}
          timeAgo={post.timeAgo}
          user={post.user}
          userPhoto={post.user.avatar}
          likes={post.likes}
          commentsNumber={post.commentsNumber}
          likedUsers={post.likedUsers}
        />
      ))}
      <div ref={observerRef} style={{ height: "1px" }} />
      {loading && <PostsLoading />}
    </>
  );
}
