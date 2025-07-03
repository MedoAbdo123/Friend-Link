import React from "react";

function PostsLoading() {
  return (
    <article className="flex flex-col text-[var(--post-foreground)] animate-pulse w-full bg-[var(--post-background)] min-h-120 sm:w-[600px] border-1 rounded-2xl shadow-lg shadow-white post">
      <div className="w-full flex flex-row-reverse items-center justify-between p-4">
        <time className="w-11 rounded-full h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></time>
        <header className="flex items-center h-12 gap-2">
          <div className="size-10 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
          <h1 className="w-26 rounded-full h-7 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></h1>
        </header>
      </div>
      <section className="p-4">
        <h3  className="w-1/2 rounded-full h-7 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></h3>
        <br />
        <p  className="w-3/4 rounded-full h-7 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></p>
      </section>
      <section className="p-4">
        <div  className="h-100 rounded-xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
      </section>
      <section className="w-21 flex">
        <div className="w-full py-2 flex px-5 items-center justify-start"></div>
      </section>
    </article>
  );
}

export default PostsLoading;
