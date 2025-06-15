import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store?.user?.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      console.log("Response is :", chat);

      const chatMessages = chat?.data?.message.map((msg) => {
        const { senderId, text } = msg;
        return { senderId, text };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.log("Error in fetching the user chat message :", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!user) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageRecived", ({ senderId, text }) => {
      // console.log(firstName + " : " + text);
      // setMessages((msg) => msg.push({ firstName, text }));
      setMessages((msg) => [...msg, { senderId, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    // <div>
    //   <div className="w-[90%] mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
    //     <h1 className="p-5 border-b border-gray-600">Chat</h1>
    //     <div className="flex-1 overflow-scroll p-5">
    //       {messages?.map((msg, index) => {
    //         console.log("msg.senderId is :", msg.senderId);
    //         return (
    //           <div
    //             key={index}
    //             className={
    //               "chat " +
    //               (userId === msg.senderId ? "chat-end" : "chat-start")
    //             }
    //           >
    //             {/* secondary */}
    //             {/* chat-bubble-primary */}
    //             <div
    //               className={
    //                 "chat-bubble " +
    //                 (userId === msg.senderId
    //                   ? "chat-bubble-primary"
    //                   : "chat-bubble-secondary")
    //               }
    //             >
    //               {msg.text}
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div>
    //     <div className="p-5 border-t border-gray-600 flex items-center gap-2">
    //       <input
    //         type="text"
    //         placeholder="Type here"
    //         value={newMessage}
    //         onChange={(e) => setNewMessage(e.target.value)}
    //         className="input input-bordered w-full"
    //       />
    //       <button onClick={sendMessage} className="btn btn-success">
    //         Send
    //       </button>

    //       {/* <button className="btn">Button</button> */}
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white py-6 px-3 sm:px-4">
      <div className="w-full max-w-[95%] sm:max-w-2xl md:max-w-4xl mx-auto bg-slate-900 border border-gray-700 rounded-2xl shadow-lg h-[80vh] sm:h-[75vh] md:h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-700 text-lg sm:text-xl font-semibold text-center tracking-wide">
          💬 Chat Room
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-slate-800">
          {messages?.map((msg, index) => {
            const isCurrentUser = userId === msg.senderId;
            return (
              <div
                key={index}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-md px-4 py-2 rounded-2xl text-sm break-words ${
                    isCurrentUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-gray-700 bg-slate-800 flex gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-sm sm:text-base"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition text-sm sm:text-base"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
