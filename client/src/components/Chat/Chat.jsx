/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";

import { SendIcon, ImageIcon } from "../../constants/index";
import "./Chat.scss";

function Chat({ socket, username, chatRoom }) {
  const [currentMessage, setCurrentMessage] = useState({ text: "", image: "" });
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (currentMessage.text !== "" || currentMessage.image !== "") {
      const messageData = {
        chatRoom: chatRoom,
        author: username,
        message: currentMessage.text,
        image: currentMessage.image,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage({ text: "", image: "" });
    }
  };

  const disconnectUser = () => {
    socket.emit("leave_room", chatRoom);
    setMessageList((list) => [...list]);
    navigate("/", { state: { username: "", chatRoom: "" } });
  };

  useMemo(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div className="chatWrapper">
      <div className="chatWindow">
        <div className="chatHeader">
          <p>chatroom:</p>
          <h1>{chatRoom}</h1>
        </div>
        <ScrollToBottom className="chatBody">
          <div className="messageContainer">
            {messageList.map((userMessage, index) => (
              <div
                key={index}
                className="message"
                id={username === userMessage.author ? "you" : "other"}
              >
                <div className="messageContent">
                  {userMessage.message && <p>{userMessage.message}</p>}
                  {userMessage.image && (
                    <img src={userMessage.image} alt="Shared" />
                  )}
                </div>
                <div className="messageMeta">
                  <p id="author">{userMessage.author}</p>
                  <p id="time">{userMessage.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollToBottom>
        <div className="chatFooter">
          <input
            type="text"
            value={currentMessage.text}
            placeholder="Message..."
            onChange={(e) => {
              setCurrentMessage((prevMessage) => ({
                ...prevMessage,
                text: e.target.value,
              }));
            }}
            onKeyDown={(e) => {
              e.key === "Enter" && sendMessage();
            }}
          />
          <label htmlFor="upload-image" className="uploadImageBtn">
            <ImageIcon className="imageIcon" />
            <input
              id="upload-image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setCurrentMessage((prevMessage) => ({
                      ...prevMessage,
                      image: reader.result,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          <button onClick={sendMessage}>
            <SendIcon className="icon" />
          </button>
        </div>
      </div>
      <div id="leaveBtn">
        <button onClick={disconnectUser}>Leave chat</button>
      </div>
    </div>
  );
}

export default Chat;
