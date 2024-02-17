import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
export const socketContext = createContext(null);

export const useSocket = () => {
  const _io = useContext(socketContext);
  return _io;
};

const SocketContext = ({ children }) => {
  const _io = useMemo(() => io("localhost:4000/"), []);
  return (
    <socketContext.Provider value={_io}>{children}</socketContext.Provider>
  );
};

export default SocketContext;
