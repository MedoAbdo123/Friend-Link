"use client";
import React, { createContext, useContext, useState } from "react";

type CommentType = {
  _id: string;
  content: string;
  user: {
    name: string;
    avatar: string;
  };
};

type CommentsCache = {
  [postId: string]: CommentType[];
};

const CommentsContext = createContext<{
  commentsCache: CommentsCache;
  setCommentsCache: React.Dispatch<React.SetStateAction<CommentsCache>>;
}>({
  commentsCache: {},
  setCommentsCache: () => {},
});

export const CommentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [commentsCache, setCommentsCache] = useState<CommentsCache>({});
  return (
    <CommentsContext.Provider value={{ commentsCache, setCommentsCache }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useCommentsCache = () => useContext(CommentsContext);