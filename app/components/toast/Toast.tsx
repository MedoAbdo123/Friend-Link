import React from "react";

interface ToastProps {
  bg: string;
  text: string;
  message: string;
  correct?: boolean;
  error?: boolean;
}

export default function Toast({
  bg,
  text,
  message,
  correct,
  error,
}: ToastProps) {
  return (
    <article
      className="flex justify-between px-4 rounded-lg shadow-lg w-100 min-h-13 transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: bg,
        color: text,
      }}
    >
      {/* Message section */}
      {correct == true ? (
        <section className="flex items-center gap-2">
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
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          {message}
        </section>
      ) : (
        ""
      )}

      {error == true ? (
        <section className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="min-w-6 max-w-6 size-6"

          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          {message}
        </section>
      ) : (
        ""
      )}

      {/* Close button */}
      <section className="py-3 ">
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
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </section>
    </article>
  );
}
