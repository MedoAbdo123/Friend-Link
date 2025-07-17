"use client";
import { createContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

export const socket = io("https://friendlink-api.onrender.com/");
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};
