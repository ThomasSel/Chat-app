import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
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
