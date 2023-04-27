import { useEffect } from "react";

const Home = (props) => {
  useEffect(() => {
    if (!window.sessionStorage.getItem("token")) {
      props.navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    window.sessionStorage.removeItem("token");
    props.navigate("/login");
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
