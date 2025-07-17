import React, { Suspense } from "react";
import DarkMode from "./components/theme/DarkMode";
import PostsLoading from "./components/loading/PostsLoading";
import PostsWrapper from "./components/posts/PostsWrapper";
import Header from "./layout/Layout";
import AlertMessage from "./components/aletMessage/AlertMessage";
export default async function Home() {
  const res = await fetch(
    "http://localhost:3000/post/allPosts?skip=0&limit=10",
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return (
    <React.Fragment>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="flex items-center flex-col overflow-hidden space-y-25 justify-center mt-20 p-3 sm:p-0 sm:py-5">
        <Suspense
          fallback={
            <>
              <PostsLoading />
              <PostsLoading />
              <PostsLoading />
            </>
          }
        >
          <PostsWrapper initialPosts={data.data} />
        </Suspense>
      </div>
      
      <div className="w-full flex justify-end py-5 px-4">
        <DarkMode />
      </div>
    </React.Fragment>
  );
}
