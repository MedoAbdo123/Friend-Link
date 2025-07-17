"use client";
import { UserMinus, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
function RequestsClient({ data, users, pending }: any) {
  const [active, setActive] = useState<"requests" | "users" | "pending">(
    "users"
  );
  const [requests, setRequsests] = useState<any[]>(data ?? []);
  const [token, setToken] = useState<string | null>(null);
  const [addedFriend, setaddedFriend] = useState<
    { userId: string; requestId: string }[]
  >([]);
  const [statusPending, setStatusPending] = useState<any[]>(pending);
  const [seacrh, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users ?? []);

  useEffect(() => {
    setFilteredUsers(users ?? []);
  }, [users]);
  useEffect(() => {
    const getTokenFromCookies = () => {
      const cookies = document.cookie.split("; ");
      const found = cookies.find((row) => row.startsWith("token="));
      return found ? found.split("=")[1] : null;
    };
    setToken(getTokenFromCookies());
  }, []);

  async function AcceptRequest(requestId: string) {
    await fetch(`https://friend-link-api.vercel.app//friend/${requestId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRequsests((prev) => prev.filter((user) => user._id !== requestId));
  }
  async function SendRequest(receiverId: string) {
    const res = await fetch("https://friend-link-api.vercel.app//friend", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ receiverId }),
    });

    const data = await res.json();
    const requestId = data.data.request._id;

    setaddedFriend((prev) => {
      const updated = [...prev, { userId: receiverId, requestId }];
      return updated;
    });
    const targetUser = users.find((user: any) => user._id === receiverId);
    const requestData = data.request;

    setStatusPending((prev) => [
      ...prev,
      {
        ...requestData,
        receiverId: targetUser,
      },
    ]);
  }

  async function DeclineRequest(requestId: string) {
    await fetch(`https://friend-link-api.vercel.app//friend/${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRequsests((prev) => prev.filter((user) => user._id !== requestId));
  }

  async function CancelRequest(userId: string, requestId?: string) {
    let targetRequestId = requestId;

    if (!targetRequestId) {
      const request = addedFriend.find((item) => item.userId === userId);
      if (!request) return;
      targetRequestId = request.requestId;
    }

    try {
      await fetch(
        `https://friend-link-api.vercel.app//friend/${targetRequestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setaddedFriend((prev) => prev.filter((item) => item.userId !== userId));
      setStatusPending((prev) =>
        prev.filter(
          (item) =>
            item._id !== targetRequestId && item.receiverId?._id !== userId
        )
      );
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  }

  function handleInputChane(e: React.ChangeEvent<HTMLInputElement>) {
    const searchUser = e.target.value;
    setSearch(searchUser);

    const filtered = users.filter(
      (user: any) =>
        user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.username.toLowerCase().includes(searchUser.toLowerCase())
    );

    setFilteredUsers(filtered);
  }

  return (
    <article className="flex items-center mt-5 flex-col w-full h-auto">
      <section className="w-[95%] sm:w-145 bg-gray-300 p-2 rounded grid grid-cols-3 gap-2 mt-5">
        <button
          onClick={() => setActive("requests")}
          className={`flex items-center cursor-pointer justify-center space-x-1 py-2 rounded text-xs sm:text-sm transition-all duration-300
      ${
        active === "requests"
          ? "bg-white text-black"
          : "bg-transparent text-gray-700"
      }`}
        >
          <UserPlus size={17.5} />
          <p>Requests</p>
          {requests.length > 0 && active === "requests" && (
            <span className="rounded-full  text-black size-5 bg-gray-200 text-xs flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActive("users")}
          className={`flex items-center cursor-pointer justify-center space-x-1 py-2 rounded text-xs sm:text-sm transition-all duration-300
      ${
        active === "users"
          ? "bg-white text-black"
          : "bg-transparent text-gray-700"
      }`}
        >
          <Users size={17.5} />
          <p>Discover</p>
        </button>

        <button
          onClick={() => setActive("pending")}
          className={`flex items-center cursor-pointer justify-center space-x-1 py-2 rounded text-xs sm:text-sm transition-all duration-300
      ${
        active === "pending"
          ? "bg-white text-black"
          : "bg-transparent text-gray-700"
      }`}
        >
          <UserMinus size={17.5} />
          <p>Pending</p>
        </button>
      </section>

      <br />
      {active == "requests" && (
        <div className="px-3 w-full flex mt-2 justify-center items-center">
          <section className="border-[1px] border-[var(--border-color)] shadow-gray- shadow flex flex-col w-full sm:w-145 p-3 mt-1 rounded">
            <header className="flex space-x-2 items-center">
              <UserPlus size={22} />
              <h1 className="text-2xl font-bold block">Friend Requests</h1>
            </header>
            {Array.isArray(requests) && requests.length > 0 ? (
              <p>You have {requests.length} pending friend requests</p>
            ) : (
              <div>
                <p>No pending friend requests</p>

                <section className="w-full flex items-center my-5 flex-col">
                  <UserPlus size={50} />
                  <p>No friend requests at the moment</p>
                  <p>Check back later or discover new people!</p>
                </section>
              </div>
            )}

            <main className="mt-6 flex flex-col space-y-5">
              {Array.isArray(requests) && requests.length > 0
                ? requests.map((request: any) => (
                    <div
                      key={request._id}
                      className="border-[1px] border-[var(--border-color)] space-x-3 p-3 rounded flex items-center w-full flex-wrap"
                    >
                      <img
                        src={request.senderId.avatar}
                        alt={request.senderId.name}
                        className="size-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <Link href={`/profile/${request.senderId.username}`}>
                          {request.senderId.name}
                        </Link>
                        <p className="text-xs text-start text-gray-600">
                          {request.senderId.username}
                        </p>
                      </div>
                      <div className="flex flex-grow items-center justify-end space-x-4">
                        <button
                          onClick={() => AcceptRequest(request._id)}
                          className="bg-green-600 text-white p-2 min-w-20 rounded transition-all duration-300 cursor-pointer hover:bg-green-700"
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
                        <button
                          onClick={() => DeclineRequest(request._id)}
                          className="sm:border-[1px] sm:border-[var(--border-color)] sm:bg-transparent bg-red-500 shadow-gray-800 p-2 min-w-20 rounded  transition-all duration-300 cursor-pointer hover:bg-red-500 hover:border-red-500 hover:text-white"
                        >
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
                : ""}
            </main>
          </section>
        </div>
      )}
      {active == "users" && (
        <div className="px-3 py-4 w-full flex mt-2 justify-center items-center">
          <section className="border-[1px] border-[var(--border-color)] h-auto flex flex-col w-full sm:w-145 p-3 mt-1 rounded">
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
                  className="border w-full rounded border-[var(--border-color)] p-1 px-8"
                  placeholder="Search by name or username..."
                  value={seacrh}
                  onChange={handleInputChane}
                />
              </label>
            </form>

            <main className="mt-6 flex flex-col space-y-5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => {
                  const isRequested = addedFriend.some(
                    (item) => item.userId.toString() === user._id.toString()
                  );

                  return (
                    <div
                      key={user._id}
                      className="border-[1px] border-[var(--border-color)] transition-all duration-300 shadow space-x-3 p-3 rounded flex items-center w-full flex-wrap"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="size-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <Link href={`/profile/${user.username}`}>
                          {user.name}
                        </Link>
                        <p className="text-xs text-start text-gray-600">
                          {user.username}
                        </p>
                      </div>
                      <div className="flex flex-grow items-center justify-end space-x-4">
                        {isRequested ? (
                          <button
                            onClick={() => CancelRequest(user._id)}
                            className="p-2 min-w-20 rounded border border-[var(--border-color)] cursor-pointer"
                          >
                            <span className="flex gap-1 items-center">
                              <UserMinus size={15} />
                              <p className="leading-none text-sm font-bold">
                                Cancel Request
                              </p>
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => SendRequest(user._id)}
                            className="p-2 min-w-20 rounded border border-[var(--border-color)] cursor-pointer"
                          >
                            <span className="flex gap-1 items-center">
                              <UserPlus size={15} />
                              <p className="leading-none text-sm font-bold">
                                Send Request
                              </p>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full flex flex-col justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <p className="font-bold text-2xl">User not found</p>
                </div>
              )}
            </main>
          </section>
        </div>
      )}
      {active == "pending" && (
        <div className="px-3 py-4 w-full flex mt-2 justify-center items-center">
          <section className="border-[1px] border-[var(--border-color)] h-auto flex flex-col w-full sm:w-145 p-3 mt-1 rounded">
            <header className="flex space-x-2 items-center">
              <Users size={22} />
              <h1 className="text-2xl font-bold block">Pending Requests</h1>
            </header>

            <main className="mt-6 flex flex-col space-y-5">
              {statusPending.length > 0 ? (
                statusPending.map((user: any, index) => {
                  return (
                    <div
                      key={user._id || index}
                      className="border-[1px] border-[var(--border-color)] transition-all duration-300 shadow space-x-3 p-3 rounded flex items-center w-full flex-wrap"
                    >
                      <img
                        src={user.receiverId.avatar}
                        alt={user.receiverId.name}
                        className="size-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <Link href={`/profile/${user.receiverId.username}`}>
                          {user.receiverId.name}
                        </Link>
                        <p className="text-xs text-start text-gray-600">
                          {user.receiverId.username}
                        </p>
                      </div>
                      <div className="flex flex-grow items-center justify-end space-x-4">
                        <button
                          onClick={() =>
                            CancelRequest(
                              user.receiverId?._id || user.userId,
                              user._id
                            )
                          }
                          className="p-2 min-w-20 rounded border border-[var(--border-color)] cursor-pointer"
                        >
                          <span className="flex gap-1 items-center">
                            <UserMinus size={15} />
                            <p className="leading-none text-sm font-bold">
                              Cancel Request
                            </p>
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full flex justify-center items-center flex-col">
                  <UserMinus size={50} />

                  <h1 className="text-xl font-bold">
                    There are no pending requests.
                  </h1>
                </div>
              )}
            </main>
          </section>
        </div>
      )}
    </article>
  );
}

export default RequestsClient;
