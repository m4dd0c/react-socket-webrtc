import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/socketContext";
import PeerService from "../services/PeerService";
import MsgCard from "../components/MsgCard";
import boss from "./boss.mp4";
const Room = () => {
  const [msgText, setMsgText] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [bugToFeature, setBugToFeature] = useState("call");
  const [lc, setLc] = useState(null);
  const [rc, setRc] = useState(null);

  const _io = useSocket();

  const handleSendBtn = useCallback(() => {
    _io.emit("msg:send", { msg: msgText, id: _io.id });
  }, [_io, msgText]);

  const handleRecvMsg = useCallback(
    ({ msg, name }) => {
      console.log("recv msg", msg);
      const list = [...msgList, { text: msg, sender: name }];
      setMsgList(list);
    },
    [msgList]
  );
  const handleMe = useCallback(
    ({ name, socketId }) => {
      setLc({ name, socketId });
    },
    [lc]
  );
  const handleRc = useCallback(
    ({ name, socketId }) => {
      setRc({ name, socketId });
    },
    [rc]
  );

  const addTracks = useCallback(
    (stream) => {
      for (let track of stream.getTracks())
        PeerService.peer.addTrack(track, stream);
    },
    [PeerService.peer]
  );

  const createStreamSetToLocalAndAddTracks = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    addTracks(stream);
  }, [localStream]);

  const callHandler = useCallback(async () => {
    if (!rc) return;
    await createStreamSetToLocalAndAddTracks();
    const offer = await PeerService.getOffer();
    _io.emit("create:call", { to: rc.socketId, offer });
    setBugToFeature("click to confirm call");
  }, [_io, rc, createStreamSetToLocalAndAddTracks, bugToFeature]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      await createStreamSetToLocalAndAddTracks();
      const answer = await PeerService.getAnswer(offer);
      _io.emit("call:accepted", { to: from, answer });
    },
    [_io, createStreamSetToLocalAndAddTracks]
  );

  const handleCallAccepted = useCallback(async ({ answer }) => {
    await PeerService.setRemoteDescriptionWithAnswer(answer);
  }, []);

  const peerTrackEventHandler = useCallback(
    (ev) => {
      const stream = ev.streams[0];
      if (stream) setRemoteStream(stream);
      console.log("remoteStream", remoteStream);
      if (remoteStream) setBugToFeature("in a call");
    },
    [remoteStream, bugToFeature]
  );

  useEffect(() => {
    PeerService.peer.addEventListener("track", peerTrackEventHandler);
    return () => {
      PeerService.peer.removeEventListener("track", peerTrackEventHandler);
    };
  }, [PeerService.peer, peerTrackEventHandler]);

  useEffect(() => {
    _io.on("me", handleMe);
    _io.on("msg:recv", handleRecvMsg);
    _io.on("rc:joined", handleRc);
    _io.on("incoming:call", handleIncomingCall);
    _io.on("call:accepted", handleCallAccepted);

    return () => {
      _io.off("me", handleMe);
      _io.off("msg:recv", handleRecvMsg);
      _io.off("rc:joined", handleRc);
      _io.off("incoming:call", handleIncomingCall);
      _io.off("call:accepted", handleCallAccepted);
    };
  }, [
    _io,
    handleCallAccepted,
    handleIncomingCall,
    handleRc,
    handleRecvMsg,
    handleMe,
  ]);

  return (
    <div className="min-h-screen pb-4 w-screen">
      <h1 className="text-center py-5 text-white text-5xl font-extrabold mb-4 50vh">
        <span className="text-blue-400">webRTC</span> Video Chat
      </h1>
      <div className="py-10">
        <button className="mx-auto block mb-5" onClick={callHandler}>
          {bugToFeature}
        </button>
        <div className="flex justify-evenly md:flex-row flex-col w-screen">
          <div className="lc-user-container md:w-[45vw] w-full">
            <div className="lc-user bg-neutral-900 mx-auto w-full overflow-hidden">
              <ReactPlayer url={localStream} playing />
            </div>
            <h2 className="text-center my-2 font-bold ">
              Local ({lc && lc.name})
            </h2>
          </div>
          <div className="rc-user-container md:w-[45vw] w-full">
            <div className="lc-user bg-neutral-900 mx-auto w-full overflow-hidden">
              <ReactPlayer url={remoteStream} playing />
            </div>
            <h2 className="text-center my-2 font-bold">
              Remote ({rc && rc.name})
            </h2>
          </div>
        </div>
      </div>
      {/* //* message system  */}
      <div className="msg-container 50vh">
        <div className="msgs overflow-y-auto">
          {msgList.length > 0 &&
            msgList.map((message, idx) => (
              <MsgCard
                dir={message.sender === lc?.name ? "r" : "l"}
                key={idx}
                sender={message.sender.split("")[0]}
                text={message.text}
              />
            ))}
        </div>
        <div className="box">
          <div className="fixed bottom-0 w-full">
            <div className="flex justify-evenly">
              <input
                className="block w-full bg-transparent border-neutral-700 border-2 mr-2"
                type="text"
                placeholder="enter you message..."
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
              />
              <button
                className="bg-neutral-700 text-white"
                onClick={handleSendBtn}
              >
                send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
