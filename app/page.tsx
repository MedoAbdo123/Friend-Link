import React from "react";
import DarkMode from "./components/theme/DarkMode";
import PostsWrapper from "./components/posts/PostsWrapper";
import Header from "./layout/Layout";
export const metadata = {
  title: "Friend Link - تواصل مع أصدقائك",
  description:
    "موقع Friend Link هو شبكة اجتماعية تساعدك على التواصل ومشاركة اللحظات مع أصدقائك.",
  keywords: ["Friend Link", "موقع اجتماعي", "تواصل", "مشاركة", "شبكة اجتماعية"],
  authors: [{ name: "Ahmad", url: "https://friend-link.netlify.app/" }],
  openGraph: {
    title: "Friend Link - شبكة اجتماعية جديدة",
    description: "انضم إلى Friend Link وابدأ في التواصل مع أصدقائك الآن.",
    url: "https://friend-link.netlify.app/",
    siteName: "Friend Link",
    images: [
      {
        url: "public/favicon.ico",
        width: 800,
        height: 600,
      },
    ],
    locale: "ar",
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
