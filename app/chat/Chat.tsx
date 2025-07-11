"use client";
import { Image, Send } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Friends from "../components/friends/Friends";
import { ChatProps, MessageProps, MyPayload } from "../exports/exports";
import { jwtDecode } from "jwt-decode";
import { WebsocketContext } from "../contexts/WebsocketContext";

function Chat({ firendsData }: ChatProps) {
  const [windowWidth, setWindowWidth] = useState(0);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<MyPayload | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [typeMessage, setTypeMessage] = useState("");
  const [roomId, setRoomId] = useState("");

  const socket = useContext(WebsocketContext);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (tokenCookie) {
      const actualToken = tokenCookie.split("=")[1];
      setToken(actualToken);
      try {
        const decodedToken = jwtDecode<MyPayload>(actualToken);
        setDecoded(decodedToken);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const friends = firendsData;

  function handleShowMessages() {
    setShowMessages(!showMessages);
  }

  async function getMessages(roomId: string, friend: any) {
    handleShowMessages();
    setSelectedFriend(friend);
    const res = await fetch(`http://localhost:3000/messages/${roomId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setMessages(data);
  }

  async function sendMessage() {
    const res = await fetch(`http://localhost:3000/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: typeMessage, roomId: roomId }),
    });
    const data = await res.json();

    return data;
  }

  useEffect(() => {
    if (socket) {
      console.log("Already connected!");
      socket.on("onMessage", (newMessage: MessageProps) => {
        console.log(newMessage);
        setMessages((prev) => [...prev, newMessage]);
        console.log("newMessage");
      });

      socket.on("connect", () => {
        console.log("Connected to WebSocket!");
      });
    }

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket!");
    });

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("onMessage");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("joinRoom", roomId);
      console.log(`Joined room: ${roomId}`);
    }
  }, [socket, roomId]);

  return (
    <article className="w-full min-h-screen sm:py-2 sm:px-4 flex gap-4">
      {windowWidth < 1280 ? (
        <section
          className={`message-app w-full h-screen bg-gray-800 sm:rounded-2xl border border-gray-600 ${
            showMessages ? " hidden" : "blook"
          }`}
        >
          <h1 className="font-bold text-2xl px-7 py-5">Messages</h1>
          <label className="relative w-full flex justify-center">
            <input
              type="text"
              placeholder="Search friends..."
              className="border px-8 border-gray-500 p-1 w-[90%] rounded bg-[rgba(255,255,255,0.05)]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 absolute left-10 top-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </label>
          <br />
          <hr className="text-gray-600" />

          <div>
            {friends.map((friend) => (
              <Friends
                onClick={() => {
                  getMessages(friend.roomId, friend);
                  setRoomId(friend.roomId);
                }}
                name={friend.data.name}
                avatar={friend.data.avatar}
                key={friend.data._id}
              />
            ))}
          </div>
        </section>
      ) : (
        <section
          className={`message-app w-105 h-screen bg-gray-800 rounded-2xl border border-gray-600 `}
        >
          <h1 className="font-bold text-2xl px-7 py-5">Messages</h1>
          <label className="relative w-full flex justify-center">
            <input
              type="text"
              placeholder="Search friends..."
              className="border px-8 border-gray-500 p-1 w-[90%] rounded bg-[rgba(255,255,255,0.05)]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 absolute left-8 top-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </label>
          <br />
          <hr className="text-gray-600" />
          <div>
            {friends.map((friend) => (
              <Friends
                onClick={() => {
                  getMessages(friend.roomId, friend);
                  setRoomId(friend.roomId);
                }}
                name={friend.data.name}
                avatar={friend.data.avatar}
                key={friend.data._id}
              />
            ))}
          </div>
        </section>
      )}
      {showMessages ? (
        <section
          className={`flex-grow flex flex-col h-screen message-app bg-gray-800 sm:rounded-2xl border border-gray-600 ${
            windowWidth < 1280 ? (showMessages ? "block" : "hidden") : "block"
          }`}
        >
          <div className="flex flex-col sticky top-[-2px] sm:top-0 z-10">
            <header className="p-6 flex items-center gap-2 sticky top-[-2px]  bg-gray-800 backdrop-blur z-10">
              <button
                onClick={() => setShowMessages(false)}
                className="transition-all duration-300 hover:bg-gray-700 p-2 rounded cursor-pointer"
              >
                <IoMdArrowRoundBack size={20} />
              </button>
              {selectedFriend && (
                <img
                  src={selectedFriend.data.avatar}
                  className="size-10 object-cover rounded-full"
                  alt={selectedFriend.data.name}
                />
              )}
              <p>{selectedFriend?.data.name}</p>
            </header>
            <hr className="text-gray-600" />
          </div>
          {messages?.map((message) => (
            <main
              key={message._id}
              className={`flex w-full h-screen mt-1 ${
                message.senderId._id === decoded?.id
                  ? "justify-end"
                  : "justify-start"
              } mb-2`}
            >
              <div>
                {message.senderId._id === decoded?.id ? (
                  <section className="px-5">
                    <div className="chat-bubble-left max-w-130 h-auto bg-[#1225EB] text-white p-4 rounded-lg">
                      {message.message}
                    </div>
                  </section>
                ) : (
                  <section className="p-4 gap-2 space-y-3">
                    <div className="flex gap-2">
                      <img
                        src={message.senderId.avatar}
                        className="size-10 object-cover rounded-full place-self-end"
                      />
                      <div className="chat-bubble max-w-130 h-auto bg-[#828282] p-5 text-white rounded-tl-lg rounded-tr-lg rounded-br-lg">
                        {message.message}
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </main>
          ))}
          <section className="w-full p-4 h-19 flex justify-center sticky bottom-0 border-t-1 bg-gray-800 border-gray-600">
            <form
              onSubmit={() => sendMessage}
              className="w-full flex justify-center"
            >
              <input
                type="text"
                className="border border-gray-600 w-[98%] rounded-md px-4 pr-9"
                placeholder="Type a message"
                dir="auto"
                value={typeMessage}
                onChange={(e) => setTypeMessage(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 relative top-3.5 right-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
            </form>
            <div className="flex items-center space-x-3">
              <button>
                <Image size={20} />
              </button>
              <button
                onClick={() => sendMessage()}
                className="bg-[#1225EB] p-3 cursor-pointer flex items-center rounded-md"
              >
                <Send size={20} />
              </button>
            </div>
          </section>
        </section>
      ) : (
        <section
          className={`flex flex-grow flex-col h-screen message-app justify-center items-center
             bg-gray-800 sm:rounded-2xl border border-gray-600 ${
               windowWidth < 1280
                 ? showMessages
                   ? "block"
                   : "hidden"
                 : "block"
             }`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-26"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </span>
          <h1 className="font-black text-xl">
            Select a friend to start chatting
          </h1>
          <p className="text-gray-500">Your messages will appear here</p>
        </section>
      )}
    </article>
  );
}

export default Chat;
