import { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";

const Home = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <main>
      <section>
        <h1>This page will contain your chats soon...</h1>
        <p>At least your login details work...</p>
      </section>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </main>
  );
};

export default Home;
