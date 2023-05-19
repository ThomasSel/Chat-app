import React, { useEffect, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import Chat from "../chat/Chat";

type HomeProps = {
  navigate: NavigateFunction;
};

const Home = ({ navigate }: HomeProps): JSX.Element => {
  const [token, setToken] = useState<string | null>(
    window.sessionStorage.getItem("token")
  );
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (null === token) {
      return navigate("/login");
    }

    const newSocket = new WebSocket("ws://localhost:8000");
    newSocket.addEventListener("message", async (event) => {
      const data: Blob | string = event.data;
      const message = data instanceof Blob ? await data.text() : data;
      setMessages((prev) => [...prev, message]);
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

  return (
    <main>
      <section>
        <h1>This page will contain your chats soon...</h1>
        <p>At least your login details work...</p>
      </section>
      <Chat name="Shared Chat" messages={messages} />
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </main>
  );
};

export default Home;
