import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store?.user?.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageRecived", ({ firstName, text }) => {
      console.log(firstName + " : " + text);
      setMessages((msg) => msg.push({ firstName, text }));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div>
      <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
        <h1 className="p-5 border-b border-gray-600">Chat</h1>
        <div className="flex-1 overflow-scroll p-5">
          {messages?.map((msg, index) => {
            return (
              <div key={index} className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary">
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-5 border-t border-gray-600 flex items-center gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-500  rounded p-2"
          ></input>
          <button onClick={sendMessage} className="btn btn-secondary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
