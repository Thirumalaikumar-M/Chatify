import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

// Create Socket Context
const SocketContext = createContext();

// Custom hook to use Socket Context
export const useSocketContext = () => {
  return useContext(SocketContext);
};

// Socket Context Provider Component
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io("http://localhost:5000/", {
        query: { userId: authUser._id },
      });

      setSocket(newSocket);

      // Listen for online users update
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Cleanup on unmount or authUser change
      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
