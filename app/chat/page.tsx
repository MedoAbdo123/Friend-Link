import { Image, Send } from "lucide-react";
import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

function page() {
  return (
    <article className="w-full min-h-screen py-2 px-4 flex gap-4">
      <section className="w-105 h-screen bg-gray-800 rounded-2xl border border-gray-600">
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
      </section>

      <section className="flex-grow sm:h-screen message-app bg-gray-800 rounded-2xl border border-gray-600">
        <div className="flex flex-col sticky top-0 z-50">
          <header className="p-6 flex items-center gap-2 sticky top-0 bg-gray-800 backdrop-blur z-10">
            <button className="transition-all duration-300 hover:bg-gray-700 p-2 rounded cursor-pointer">
              <IoMdArrowRoundBack size={20} />
            </button>
            <img
              src="http://localhost:3000/uploads/ac586ff4-66cc-4d2f-9dd9-cd0233a57c85.jpg"
              className="size-10 object-cover rounded-full"
            />
            <p>Ahmad Abdo</p>
          </header>
          <hr className="text-gray-600" />
        </div>
        <main className="flex flex-col items-start">
          <section className="p-4 gap-2 space-y-3">
            <div className="flex gap-2">
              <img
                src="http://localhost:3000/uploads/ac586ff4-66cc-4d2f-9dd9-cd0233a57c85.jpg"
                className="size-10 object-cover rounded-full place-self-end"
              />
              <div className="chat-bubble w-130 h-auto bg-[#828282] p-5 text-white rounded-tl-lg rounded-tr-lg rounded-br-lg">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae
                nesciunt deleniti, officiis sequi est nemo necessitatibus.
                Voluptatibus, error. Omnis laboriosam culpa officiis, nesciunt
                modi ipsa. Repellat molestiae corrupti doloremque, reiciendis
                ullam eveniet, voluptatem fugit voluptas cumque reprehenderit
                asperiores quaerat necessitatibus incidunt mollitia quidem ipsum
                qui?
              </div>
            </div>
          </section>
          <section className="flex p-8 gap-4 w-full items-end flex-col">
            <div className="chat-bubble-left w-130 h-auto bg-[#1225EB] text-white p-5 rounded-lg">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae
              nesciunt deleniti, officiis sequi est nemo necessitatibus.
              Voluptatibus, error. Omnis laboriosam culpa officiis, nesciunt
              modi ipsa. Repellat molestiae corrupti doloremque, reiciendis
              ullam eveniet, voluptatem fugit voluptas cumque reprehenderit
              asperiores quaerat necessitatibus incidunt mollitia quidem ipsum
              nesciunt perspiciatis quod consequatur ipsam atque. Quas, libero
              qui?
            </div>{" "}
            <div className="chat-bubble-left w-130 h-auto bg-[#1225EB] text-white p-5 rounded-lg">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae
              nesciunt deleniti, officiis sequi est nemo necessitatibus.
              Voluptatibus, error. Omnis laboriosam culpa officiis, nesciunt
              modi ipsa. Repellat molestiae corrupti doloremque, reiciendis
              ullam eveniet, voluptatem fugit voluptas cumque reprehenderit
              asperiores quaerat necessitatibus incidunt mollitia quidem ipsum
              nesciunt perspiciatis quod consequatur ipsam atque. Quas, libero
              qui?
            </div>
          </section>
        </main>
        <section className="w-full p-4 h-19 flex justify-center sticky bottom-0 border-t-1 bg-gray-800 border-gray-600">
          <label className="w-full flex justify-center">
            <input
              type="text"
              className="border border-gray-600 w-[98%] rounded-md px-4 pr-9"
              placeholder="Type a message"
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
          </label>
          <div className="flex items-center space-x-3">
            <button>
              <Image size={20} />
            </button>
            <button className="bg-[#1225EB] p-3 flex items-center rounded-md">
              <Send size={20} />
            </button>
          </div>
        </section>
      </section>
    </article>
  );
}

export default page;
