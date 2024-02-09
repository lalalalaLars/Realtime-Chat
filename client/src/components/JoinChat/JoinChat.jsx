/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./JoinChat.scss";

function JoinChat({ socket }) {
  const [username, setUsername] = useState("");
  const [chatRoom, setChatRoom] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (username !== "" && chatRoom !== "") {
      socket.emit("join_room", chatRoom);
      navigate(`/${chatRoom}`, { state: { username, chatRoom } });
    }
  };

  return (
    <div className="chatContainer">
      <h1>Join Chat</h1>
      <div className="chatContainer__inputs">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Chatroom ID"
          onChange={(e) => {
            setChatRoom(e.target.value);
          }}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
    </div>
  );
}

export default JoinChat;
