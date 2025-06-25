"use client";
import { UserPlus, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
function RequestsClient({ data, users }: any) {
  const [active, setActive] = useState<"requests" | "users">("requests");
  const [requests, setRequsests] = useState<any[]>(data ?? []);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getTokenFromCookies = () => {
      const cookies = document.cookie.split("; ");
      const found = cookies.find((row) => row.startsWith("token="));
      return found ? found.split("=")[1] : null;
    };
    setToken(getTokenFromCookies());
  }, []);

  async function AcceptRequest(requestId: string) {
    await fetch(`http://localhost:3000/friend/${requestId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRequsests((prev) => prev.filter((user) => user._id !== requestId));
  }

  return (
    <article className="flex items-center mt-5 flex-col w-full h-auto">
      <section className="w-[95%] sm:w-145 bg-gray-300 h-10 p-4 rounded flex justify-center items-center space-x-2 mt-5">
        <button
          onClick={() => setActive("requests")}
          className={`cursor-pointer transition-all duration-300 min-h-8 flex-grow rounded min-w-[51%] flex justify-center pl-3 space-x-2 text-xs sm:text-sm items-center
            ${
              active === "requests"
                ? "bg-white text-black"
                : "bg-whit text-gray-600"
            }`}
        >
          <UserPlus size={17.5} />
          <p>Friend Requests</p>
          <span
            className={`${
              active == "requests"
                ? "rounded-full text-black size-5 bg-gray-200 text-xs"
                : ""
            }`}
          >
            3
          </span>
        </button>
        <button
          onClick={() => setActive("users")}
          className={`cursor-pointer transition-all duration-300 min-h-8 flex-grow rounded min-w-[51%] flex justify-center pl-3 space-x-2 text-xs sm:text-sm items-center
            ${
              active === "users"
                ? "bg-white text-black"
                : "bg-whit text-gray-600"
            }`}
        >
          <Users size={17.5} />
          <p>Friend Requests</p>
        </button>
      </section>
      <br />
      {active == "requests" && (
        <div className="px-3 w-full flex mt-2 justify-center items-center">
          <section className="border-[1px] border-gray-900 shadow-gray-800 shadow flex flex-col w-full sm:w-145 p-3 mt-1 rounded">
            <header className="flex space-x-2 items-center">
              <UserPlus size={22} />
              <h1 className="text-2xl font-bold block">Friend Requests</h1>
            </header>

            <main className="mt-6 flex flex-col space-y-5">
              {Array.isArray(requests) && requests.length > 0 ? (
                requests.map((user: any) => (
                  <div
                    key={user._id}
                    className="border-[1px] border-gray-900 shadow-gray-800 shadow space-x-3 p-3 rounded flex items-center w-full flex-wrap"
                  >
                    <img
                      src={user.senderId.avatar}
                      alt={user.senderId.name}
                      className="size-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p>{user.senderId.name}</p>
                      <p className="text-xs text-start text-gray-600">
                        {user.senderId.username}
                      </p>
                    </div>
                    <div className="flex flex-grow items-center justify-end space-x-4">
                      <button
                        onClick={() => AcceptRequest(user._id)}
                        className="bg-green-600 p-2 min-w-20 rounded transition-all duration-300 cursor-pointer hover:bg-green-700"
                      >
                        <span className="flex gap-1 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 22 22"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4 flex-shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                          <p className="leading-none">Accept</p>
                        </span>
                      </button>
                      <button className="sm:border-[1px] sm:border-gray-900 sm:bg-transparent bg-red-500 shadow-gray-800 p-2 min-w-20 rounded  transition-all duration-300 cursor-pointer hover:bg-red-500 hover:border-red-500">
                        <span className="flex gap-1 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                          <p className="leading-none">Decline</p>
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>لا توجد طلبات</div>
              )}
            </main>
          </section>
        </div>
      )}
      {active == "users" && (
        <div className="px-3 py-4 w-full flex mt-2 justify-center items-center">
          <section className="border-[1px] border-gray-900 h-auto shadow-gray-800 shadow flex flex-col w-full sm:w-145 p-3 mt-1 rounded">
            <header className="flex space-x-2 items-center">
              <Users size={22} />
              <h1 className="text-2xl font-bold block">Discover People</h1>
            </header>

            <form className="mt-5 w-full">
              <label className="relative flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 absolute left-2 top-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  type="text"
                  className="border w-full rounded border-gray-800 p-1 px-8"
                  placeholder="Search by name or username..."
                />
              </label>
            </form>

            <main className="mt-6 flex flex-col space-y-5">
              {users.map((user: any) => (
                <div
                  key={user._id}
                  className="border-[1px] border-gray-900  hover:bg-gray-900 transition-all duration-300 shadow space-x-3 p-3 rounded flex items-center w-full flex-wrap"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p>{user.name}</p>
                    <p className="text-xs text-start text-gray-600">
                      {user.username}
                    </p>
                  </div>
                  <div className="flex flex-grow items-center justify-end space-x-4">
                    <button className="p-2 min-w-20 rounded transition-all duration-300 cursor-pointer border border-gray-800 hover:bg-gray-700">
                      <span className="flex gap-1 items-center">
                        <UserPlus size={15} />
                        <p className="leading-none text-sm font-bold">
                          Add Friend
                        </p>
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </main>
          </section>
        </div>
      )}
    </article>
  );
}

export default RequestsClient;
