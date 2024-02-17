import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext";

const Lobby = () => {
  const nav = useNavigate();
  //state handling
  const [data, setData] = useState({ name: "", roomId: 1 });
  const handleState = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //getting socket
  const _io = useSocket();

  //join handler
  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (data.name && data.roomId) {
      _io.emit("join:room", data);
      nav("/" + data.roomId);
    }
  };

  return (
    <div className="h-screen grid place-items-center space-y-2 text-black">
      <div>
        <h1 className="text-white text-5xl font-extrabold mb-4">
          <span className="text-blue-400">webRTC</span> Video Chat
        </h1>
        <div className="bg-slate-800 p-4">
          <form className="space-y-4">
            <label htmlFor="name" className="text-white">
              Name
            </label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              className="w-[40vw]"
              value={data.name}
              onChange={handleState}
            />
            <br />
            <br />
            <label htmlFor="roomId" className="text-white">
              RoomId
            </label>
            <br />
            <input
              type="text"
              className="w-[40vw]"
              id="roomId"
              name="roomId"
              value={data.roomId}
              onChange={handleState}
            />
            <br />
            <button
              type="submit"
              className="bg-white"
              onClick={joinRoomHandler}
            >
              create/join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
