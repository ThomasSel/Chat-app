import React, { useEffect, useMemo, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Chat from "../chat/Chat";

type HomeProps = {
  navigate: NavigateFunction;
};

export type Message = {
  text: string;
  userId: string;
  username: string;
  iat: number;
};

export const isMessage = (o: object): o is Message => {
  return "text" in o && "userId" in o && "username" in o && "iat" in o;
};

const Home = ({ navigate }: HomeProps): JSX.Element => {
  const [token, setToken] = useState<string | null>(
    window.sessionStorage.getItem("token")
  );
  const [messages, setMessages] = useState<Message[][]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (null === token) {
      return navigate("/login");
    }

    const newSocket = new WebSocket("ws://localhost:8000");

    // Authenticate when the connection opens
    newSocket.addEventListener("open", () => {
      newSocket.send(JSON.stringify({ token: token }));
    });

    newSocket.addEventListener("message", async (event) => {
      const streamData: Blob | string = event.data;
      const messageString =
        streamData instanceof Blob ? await streamData.text() : streamData;

      const message = JSON.parse(messageString);
      if (!isMessage(message)) {
        return console.error(new Error("Invalid server message"));
      }

      setMessages((prev) => {
        if (prev.length === 0) {
          return [...prev, [message]];
        }

        const lastMessageGroup = prev[prev.length - 1];
        const lastMessage = lastMessageGroup[lastMessageGroup.length - 1];

        if (message.userId === lastMessage?.userId) {
          return [
            ...prev.slice(0, prev.length - 1),
            [...lastMessageGroup, message],
          ];
        } else {
          return [...prev, [message]];
        }
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    window.sessionStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  let userId: string;
  if (null !== token) {
    userId = useMemo<string>(() => jwtDecode<any>(token).userId, [token]);
  }

  return (
    <main>
      <Chat
        name="General"
        messages={messages}
        socket={socket}
        userId={userId}
      />
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </main>
  );
};

export default Home;
