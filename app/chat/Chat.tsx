"use client";
import { Image, Send } from "lucide-react";
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Friends from "../components/friends/Friends";
import { ChatProps, MessageProps, MyPayload } from "../exports/exports";
import EmojiPicker from "emoji-picker-react";
import { jwtDecode } from "jwt-decode";
import { WebsocketContext } from "../contexts/WebsocketContext";
import twemoji from "twemoji";
import AlertMessage from "../components/aletMessage/AlertMessage";

function Chat({ firendsData }: ChatProps) {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState<any | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<MyPayload | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [typeMessage, setTypeMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    message: MessageProps | null;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(firendsData);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socket = useContext(WebsocketContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (ref.current) {
      twemoji.parse(ref.current, {
        folder: "svg",
        ext: ".svg",
        base: "https://unpkg.com/twemoji@14.0.2/dist/",
      });
    }
  }, [messages]);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFriends(firendsData);
    } else {
      const filtered = firendsData.filter((friend) =>
        friend.data.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [searchQuery, firendsData]);

  const friends = filteredFriends;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  function handleShowMessages() {
    setShowMessages(!showMessages);
  }

  function handleRigthClick(e: React.MouseEvent, message: MessageProps) {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      message,
    });
  }

  useEffect(() => {
    function handleClick() {
      setContextMenu(null);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

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

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!typeMessage.trim() && !photo) return;

    if (isEditing && editingMessageId) {
      try {
        const res = await fetch(
          `http://localhost:3000/messages/${editingMessageId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message: typeMessage }),
          }
        );

        if (res.ok) {
          const data = await res.json();

          setMessages((prev) =>
            prev.map((message) =>
              message._id === editingMessageId
                ? { ...message, message: data.message }
                : message
            )
          );

          socket.emit("editMessage", data);

          setIsEditing(false);
          setEditingMessageId(null);
          setTypeMessage("");
        }
      } catch (error) {
        console.error("Error editing message:", error);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("message", typeMessage);
        if (photo) formData.append("photo", photo);
        formData.append("roomId", roomId);
        const res = await fetch(`http://localhost:3000/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (res.ok) {
          setTypeMessage("");
          setPhotoPreview(null);
          setPhoto(null);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("messageEdited", (updatedMessage: MessageProps) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    socket.on("onMessage", (newMessage: MessageProps) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("messageDeleted", (deletedMessageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedMessageId));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("messageEdited");
      socket.off("onMessage");
      socket.off("messageDeleted");
    };
  }, [socket]);

  async function EditMessage(messageId: string) {
    const messageToEdit = messages.find((msg) => msg._id === messageId);
    if (!messageToEdit) return;

    setTypeMessage(messageToEdit.message);

    setIsEditing(true);
    setEditingMessageId(messageId);

    setContextMenu(null);
  }

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("joinRoom", roomId);
    }
  }, [socket, roomId]);

  async function deleteMessage(messageId: string) {
    const res = await fetch(`http://localhost:3000/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    }

    socket.emit("deleteMessage", { messageId, roomId });
    setShowAlert(false)
  }

  function handleSelectPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPhoto(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  }

  return (
    <article className="w-full min-h-screen sm:py-2 sm:px-4 flex gap-4">
      {windowWidth < 1280 ? (
        <section
          className={`message-app w-full h-screen bg-[var(--bg-chat)] sm:rounded-2xl border border-gray-600 ${
            showMessages ? " hidden" : "block"
          }`}
        >
          <h1 className="font-bold text-2xl px-7 py-5">Messages</h1>
          <div className="w-full flex justify-center">
            <div className="relative w-[90%]">
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-500 p-2 pl-10 w-full rounded bg-[rgba(255,255,255,0.05)]"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          </div>

          <br />
          <hr className="text-gray-600" />

          <div>
            {friends.length > 0 ? (
              friends.map((friend) => (
                <Friends
                  onClick={() => {
                    getMessages(friend.roomId, friend);
                    setRoomId(friend.roomId);
                  }}
                  name={friend.data.name}
                  avatar={friend.data.avatar}
                  lastMessage={friend.lastMessage}
                  key={friend.data._id}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No friends found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section
          className={`message-app w-105 h-screen bg-[var(--bg-chat)] rounded-2xl border border-gray-600 `}
        >
          <h1 className="font-bold text-2xl px-7 py-5">Messages</h1>
          <label className="relative w-full flex justify-center">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border px-8 pr-16 border-gray-500 p-1 w-[90%] rounded bg-[rgba(255,255,255,0.05)]"
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
            {friends.length > 0 ? (
              friends.map((friend) => (
                <Friends
                  onClick={() => {
                    getMessages(friend.roomId, friend);
                    setRoomId(friend.roomId);
                  }}
                  name={friend.data.name}
                  avatar={friend.data.avatar}
                  lastMessage={friend.lastMessage}
                  key={friend.data._id}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No friends found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            )}
          </div>
        </section>
      )}
      {showMessages ? (
        <section
          ref={ref}
          className={`flex-grow flex flex-col h-screen message-app bg-[var(--bg-chat)] sm:rounded-2xl border border-gray-600 ${
            windowWidth < 1280 ? (showMessages ? "block" : "hidden") : "block"
          }`}
        >
          <div className="flex flex-col sticky top-[-2px] sm:top-0 z-10">
            <header className="p-6 flex items-center gap-2 sticky top-[-2px] bg-[var(--bg-chat)] backdrop-blur z-10">
              <button
                onClick={() => setShowMessages(false)}
                className="transition-all duration-300 hover:bg-[var(--bg-chat)] p-2 rounded cursor-pointer"
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

          <div className="flex-1">
            {messages?.map((message) => (
              <main
                key={message._id}
                className={`flex w-full mt-1 mb-3 transition-all duration-300 ${
                  message.senderId._id === decoded?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div>
                  {message.senderId._id === decoded?.id ? (
                    <section className="px-5 flex justify-end">
                      <div className="flex flex-col items-end max-w-80">
                        {message.message && (
                          <div
                            onContextMenu={(e) => handleRigthClick(e, message)}
                            className="chat-bubble-right bg-[#6002B7] text-white p-4 rounded-lg mb-2 max-w-full"
                          >
                            <p className="text-wrap break-words whitespace-pre-wrap">
                              {message.message}
                            </p>
                            <p className="text-xs text-[#c3c7bd]  text-end">
                              {message.edited}{" "}
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            {message.linkPreview && (
                              <a
                                href={message.linkPreview.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block border border-gray-600 rounded-md overflow-hidden bg-[#001] text-white mt-2"
                              >
                                {message.linkPreview.image && (
                                  <img
                                    src={message.linkPreview.image}
                                    alt="preview"
                                    className="w-full h-auto object-cover"
                                  />
                                )}
                                <div className="p-2">
                                  <h2 className="font-semibold">
                                    {message.linkPreview.title}
                                  </h2>
                                  <p className="text-sm text-gray-400">
                                    {message.linkPreview.description}
                                  </p>
                                  <span className="text-xs text-blue-600">
                                    {message.linkPreview.url}
                                  </span>
                                </div>
                              </a>
                            )}
                          </div>
                        )}
                        {message.photo && (
                          <div>
                            <img
                              src={message.photo}
                              className="max-w-64 h-auto rounded-lg object-cover"
                              alt="shared image"
                            />
                            <time className="relative bottom-5 left-[67%]  text-gray-500 text-start">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </time>
                          </div>
                        )}
                      </div>
                    </section>
                  ) : (
                    <section className="px-4">
                      <div className="flex gap-2">
                        <img
                          src={message.senderId.avatar}
                          className="size-10 object-cover rounded-full self-end"
                        />
                        <div className="flex flex-col gap-2">
                          {message.message && (
                            <div className="chat-bubble max-w-130 h-auto bg-[#828282] p-4 text-white rounded-tl-lg rounded-tr-lg rounded-br-lg">
                              {message.message}
                              <p className="text-xs text-[#cccec8] text-start">
                                {message.edited}{" "}
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pl-11 mt-2">
                        {message.photo && (
                          <div>
                            <img
                              src={message.photo}
                              className="max-w-64 h-auto rounded-lg object-cover"
                              alt="shared image"
                            />
                            <time className="relative bottom-5 -right-2 text-gray-500 text-start">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </time>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {contextMenu?.message && (
                  <div
                    className="absolute overflow-hidden bg-gray-700 text-white rounded shadow-md z-50"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={() => setContextMenu(null)}
                  >
                    <button
                      onClick={() => {
                        EditMessage(contextMenu.message!._id);
                      }}
                      className="px-4 gap-2 flex items-center py-2 hover:bg-gray-600 w-full text-left"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowAlert(true);
                        setMessageId(contextMenu.message?._id || "");
                        setContextMenu(null);
                      }}
                      className="px-4 flex gap-2 items-center py-2 hover:bg-gray-600 w-full text-left"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </main>
            ))}
          </div>
          <div className="w-full flex justify-end pr-2">
            {showEmojiPicker && (
              <div
                className="absolute bottom-20 z-50"
                onMouseDown={(e) => e.preventDefault()}
              >
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setTypeMessage((prev) => prev + emojiData.emoji);
                  }}
                />
              </div>
            )}
          </div>
          <section
            className={`w-full backdrop-blur p-4 flex justify-center sticky bottom-0 border-t-1 bg-[var(--bg-chat)] border-gray-600 ${
              photoPreview ? "h-39" : "h-19"
            }`}
          >
            <form
              onSubmit={sendMessage}
              className="w-full  h-full flex flex-col justify-center"
            >
              <div className="p-2">
                {photoPreview && (
                  <img src={photoPreview} className="size-16 rounded-lg" />
                )}
              </div>
              <div className="w-full h-full flex">
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
                  className="size-8 relative top-1.5 right-8 hover:bg-gray-500 p-1 rounded-full transition-all duration-300"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                  />
                </svg>
                <div className="flex items-center space-x-3">
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleSelectPhoto}
                    />
                    <Image
                      className="transition-all duration-300 cursor-pointer hover:text-gray-500"
                      size={20}
                    />
                  </label>
                  <button
                    type="submit"
                    className="bg-[#1225EB] p-3 cursor-pointer flex items-center rounded-md"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </form>
          </section>
        </section>
      ) : (
        <section
          className={`flex flex-grow flex-col h-screen message-app justify-center items-center
             bg-[var(--bg-chat)] sm:rounded-2xl border border-gray-600 ${
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

      {showAlert == true && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <AlertMessage
            no={() => setShowAlert(false)}
            yes={() => deleteMessage(messageId)}
            text="Do you really want to delete the message?"
          />
        </div>
      )}
    </article>
  );
}

export default Chat;
