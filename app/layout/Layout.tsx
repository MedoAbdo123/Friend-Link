"use client";
import { jwtDecode } from "jwt-decode";
import { FilePenLine, House } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type MyPayload = {
  name: string;
  avatar: string;
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{
    avatar?: string;
    name?: string;
  } | null>(null);

  function Logut() {
    localStorage.removeItem("token")
    window.location.href = "/";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  useEffect(() => {
    const tokenCookies = document.cookie;
    const tokenMatch = tokenCookies
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (tokenMatch) {
      const tokenValue = tokenMatch.split("=")[1];

      try {
        if (tokenValue && tokenValue.split(".").length === 3) {
          const decode = jwtDecode<MyPayload>(tokenValue);
          setUserData(decode);
        } else {
          console.warn("Invalid token format.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <header className="bg-[var(--background-header)] text-[var(--foreground)] shadow-[#001] shadow-xl relative">
      <style jsx>{`
        .mobile-menu {
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
        }

        .mobile-menu.open {
          transform: translateX(0);
        }
      `}</style>

      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link
              className="sm:text-4xl text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"
              href="/"
            >
              FriendLink
            </Link>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 flex-row-reverse text-sm">
                <li>
                  <Link
                    className="transition flex items-center flex-col"
                    href="/myProfile"
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
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition flex items-center flex-col"
                    href="/chat"
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
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                      />
                    </svg>
                    Chat
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition flex items-center flex-col"
                    href="/createPost"
                  >
                    <FilePenLine />
                    Add Post
                  </Link>
                </li>

                <li>
                  <Link
                    className="flex flex-col items-center transition"
                    href="/requests"
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
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                      />
                    </svg>
                    Friend Requests
                  </Link>
                </li>

                <li>
                  <Link className="flex flex-col items-center transition" href="/">
                    <House />
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center h-full gap-4">
            {userData ? (
              <div className="sm:flex sm:gap-4 flex items-center gap-1">
                <h1 className="text-xs sm:text-lg">{userData.name}</h1>
                <img
                  onClick={() => alert()}
                  src={userData.avatar}
                  className="size-9 rounded-full object-cover"
                />
                <div className="hidden sm:flex">
                  <button
                    onClick={Logut}
                    className="block w-full cursor-pointer rounded-md px-5 py-2.5 text-center text-sm font-medium border-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="sm:flex sm:gap-4">
                <Link
                  className="rounded-md bg-green-500 px-5 py-2.5 text-sm font-medium text-[var(--foreground-comment)] shadow-sm sm:bg-transparent sm:border-1 sm:border-green-500 hover:bg-green-500 transition-all hover:text-white"
                  href="/login"
                >
                  Login
                </Link>

                <div className="hidden sm:flex">
                  <Link
                    className="block w-full rounded-md px-5 py-2.5 text-center text-sm font-medium bg-gray-600 text-white"
                    href="/register"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
            <div className="block md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="rounded-sm bg-gray-800 p-2 text-white transition hover:text-gray-100/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${
          isMobileMenuOpen ? "open" : ""
        } md:hidden fixed top-0 right-0 h-full w-64 bg-[var(--bg-menu)] text-[var(--forground)] shadow-lg z-50 p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="text-teal-600 font-semibold text-lg">Menu</div>
          <button onClick={toggleMobileMenu} className="text-[var(-forground)]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav>
          <ul className="flex flex-col-reverse items-start gap-6 text-sm">
            <li>
              <Link
                className="flex items-center gap-1 transition"
                href="/myProfile"
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
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Profile
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1 transition" href="/chat">
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
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
                Chat
              </Link>
            </li>
            <li>
              <Link className=" flex items-center gap-1 transition" href="/createPost">
                <FilePenLine />
                Add Post
              </Link>
            </li>

            <li>
              <Link
                className="flex items-center gap-1 transition"
                href="/requests"
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
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
                Friend Requests
              </Link>
            </li>

            <li>
              <Link className=" flex items-center gap-1 transition  " href="/">
                <House />
                Home
              </Link>
            </li>
          </ul>
          {/* Buttons */}
          <div className="mt-8 space-y-3">
            {userData ? (
              <div className="space-y-4">
                <button
                  onClick={Logut}
                  className="block w-full cursor-pointer rounded-md px-5 py-2.5 text-center text-sm font-medium border-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  className="block w-full rounded-md bg-green-500 px-5 py-2.5 text-center text-sm font-medium text-[var(--foreground-comment)] shadow-sm sm:bg-transparent sm:border-1 sm:border-green-500 hover:bg-green-500 transition-all hover:text-white"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="block w-full rounded-md px-5 py-2.5 text-center text-sm font-medium bg-gray-600 text-white"
                  href="/register"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </header>
  );
}
