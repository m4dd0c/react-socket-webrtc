import { Route, Routes } from "react-router-dom";
import Lobby from "./screens/Lobby.jsx";
import Room from "./screens/Room.jsx";

function App() {
  return (
    <div className="bg-black text-white">
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
