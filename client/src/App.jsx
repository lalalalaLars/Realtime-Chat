import { Routes, Route, useLocation } from "react-router-dom";
import io from "socket.io-client";
import Chat from "../src/components/Chat/Chat";
import JoinChat from "../src/components/JoinChat/JoinChat";

const socket = io.connect("http://localhost:3001", {
  transports: ["websocket"],
});

function App() {
  const location = useLocation();
  const { state } = location;

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<JoinChat socket={socket} />} />
        <Route
          path="/:id"
          element={
            <Chat
              socket={socket}
              username={state?.username}
              chatRoom={state?.chatRoom}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
