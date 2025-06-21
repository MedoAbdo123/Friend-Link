import React from "react";

function CommentsLoading() {
  return (
    <div className="w-full animate-pulse bg-[var(--background-comment)] min-h-13 rounded">
      <section className="pt-1 px-4 flex items-center  space-x-3">
        <div className="size-10 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
        <div className="w-30 h-6 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
      </section>
      <div className="pb-4 px-17 space-y-2">
        <div className="w-1/1 h-6 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
        <div className="w-1/1 h-6 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
        <div className="w-1/1 h-6 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
      </div>
    </div>
  );
}

export default CommentsLoading;
