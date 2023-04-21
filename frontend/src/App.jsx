import { Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import "./App.css";

function App() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/signup" element={<Signup navigate={navigate} />} />
      <Route path="/login" element={<Login navigate={navigate} />} />
      <Route path="/chats" element={<Home navigate={navigate} />} />
    </Routes>
  );
}

const Temp = (props) => {
  const navigate = useNavigate();

  return (
    <main>
      <button
        onClick={() => {
          navigate(props.path);
        }}
      >
        Go to {props.path}
      </button>
    </main>
  );
};

export default App;
