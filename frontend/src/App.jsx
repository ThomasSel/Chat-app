import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/one" element={<Temp path="/two" />} />
      <Route path="/two" element={<Temp path="/one" />} />
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
