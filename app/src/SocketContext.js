import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

// const socket = io("http://localhost:5000");
const socket = io("https://ting-ting.herokuapp.com/");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [accessCamera, setAccessCamera] = useState(false);
  const [cameraAccessed, setCameraAccessed] = useState(false);
  const [callOutgoing, setCallOutgoing] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState(localStorage.getItem("name") || "");

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  function getCameraAccess() {
    return navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 1024, ideal: 720, max: 1840 },
        height: { min: 576, ideal: 1280, max: 4000 },
      },
      audio: true,
    });
  }

  useEffect(() => {
    getCameraAccess()
      .then((currentStream) => {
        setCameraAccessed(true);
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      })
      .catch(() => {
        setCameraAccessed(false);
        console.log("Unable to access Camera and Mic");
      });
  }, [accessCamera]);

  useEffect(() => {
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      console.log("Receiving call");
      setCall({
        isReceivingCall: true,
        from,
        name: callerName,
        signal,
      });
    });

    socket.on("endCall", () => {
      console.log("Ending call");
      setCall({
        isReceivingCall: false,
      });
      setCallEnded(true);
      window.location.reload();
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    if (!cameraAccessed) {
      alert("Provide camera access to call other user");
      console.log("Provide camera access to call other user");
      setAccessCamera(!accessCamera);
      return;
    }

    if (!name || name === "") {
      alert("Please set your name to make call!");
      return;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      setCallOutgoing(true);
      socket.emit("calluser", {
        recepient: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      setCallOutgoing(false);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = (id) => {
    setCallEnded(true);
    setCallOutgoing(false);
    if (!id) {
      setCallAccepted(false);
    }

    socket.emit("endCall", {
      recepient: id ? id : call.from,
    });
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        callOutgoing,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
