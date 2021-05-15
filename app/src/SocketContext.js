import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import CallUtility from "./utilities/CallUtility";

const SocketContext = createContext();

// const socket = io("http://localhost:5000");
const socket = io("https://ting-ting.herokuapp.com/");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [call, setCall] = useState({});
  const [cameraAccessed, setCameraAccessed] = useState(false);
  // const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callOutgoing, setCallOutgoing] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState(localStorage.getItem("name") || "");

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  function getCameraAccess(accessConstraints) {
    const constraints = {
      video: {},
      audio: {},
    };
    if (accessConstraints.video) {
      if (accessConstraints.frontCamera) {
        constraints.video = true;
      } else {
        constraints.video.facingMode = "user";
      }
    } else {
      constraints.video = false;
    }

    constraints.audio = accessConstraints.audio;

    return navigator.mediaDevices.getUserMedia(constraints);
  }

  useEffect(() => {
    let cameraAccessConstraints = {
      // frontCamera: isFrontCamera,
      audio: audioEnabled,
      video: videoEnabled,
    };
    getCameraAccess(cameraAccessConstraints)
      .then((currentStream) => {
        setCameraAccessed(true);
        setStream(null);
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      })
      .catch((error) => {
        setCameraAccessed(false);
        console.log("Unable to access Camera and Mic", error);
      });
  }, [audioEnabled, videoEnabled]);

  // const changeCamera = () => {
  //   console.log("Changing camera");
  //   setIsFrontCamera(!isFrontCamera);
  // };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    socket.emit("toggleVideo", { recepient: otherUser, from: me });
  };

  const toggleAudio = () => {
    console.log("Toggling Audio");
    setAudioEnabled(!audioEnabled);
    socket.emit("toggleAudio", { recepient: otherUser, from: me });
  };

  useEffect(() => {
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("calluser", ({ from, name, signal }) => {
      console.log("Receiving call");
      setCall({
        isReceivingCall: true,
        from,
        name,
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

    socket.on("toggleAudio", () => {
      let element = document.getElementById("userVideo");
      if (element) {
        element.muted = !element.muted;
      }
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
      setOtherUser(call.from);
      socket.emit("answercall", { signal: data, to: call.from, name });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const utility = new CallUtility();
    if (utility.isNullOrEmpty(id)) {
      alert("Provide Valid User ID to call");
      console.log("Provide Valid User ID to call");
      return;
    }

    if (!cameraAccessed) {
      alert("Provide camera access to call other user");
      console.log("Provide camera access to call other user");
      return;
    }

    if (utility.isNullOrEmpty(name)) {
      alert("Please provide your name to make call!");
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

    socket.on("callaccepted", ({ signal, name }) => {
      setCallAccepted(true);
      setCallOutgoing(false);
      setOtherUser(id);
      setCall({ name });

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
        // changeCamera,
        toggleAudio,
        toggleVideo,
        audioEnabled,
        videoEnabled,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
