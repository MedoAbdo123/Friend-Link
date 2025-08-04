import React from "react";
import DarkMode from "./components/theme/DarkMode";
import PostsWrapper from "./components/posts/PostsWrapper";
import Header from "./layout/Layout";
export const metadata = {
  title: "Friend Link",
  description:
    "Friend Link is a social network that helps you connect and share with your friends.",
  keywords: [
    "Friend Link",
    "موقع اجتماعي",
    "تواصل",
    "مشاركة",
    "شبكة اجتماعية",
    "friend link",
    "friendlink",
    "friend-link",
  ],
  authors: [{ name: "Ahmad", url: "https://friend-link.netlify.app/" }],
  openGraph: {
    title: "Friend Link - New social network",
    description: "Join Friend Link and start connecting with your friends now.",
    url: "https://friend-link.netlify.app/",
    siteName: "Friend Link",
    images: [
      {
        url: "https://friend-link.netlify.app/favicon.ico",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default async function Home() {
  const res = await fetch(
    "https://friendlink-api.onrender.com/post/allPosts?skip=0&limit=10",
    {
      next: { revalidate: 60 },
    }
  );
  const data = await res.json();
  return (
    <React.Fragment>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="flex items-center flex-col overflow-hidden space-y-25 justify-center mt-20 p-3 sm:p-0 sm:py-5">
        <PostsWrapper initialPosts={data.data} />
      </div>

      <div className="w-full flex justify-end py-5 px-4">
        <DarkMode />
      </div>
    </React.Fragment>
  );
}