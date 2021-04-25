import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import ringTone from "../assets/ring_ring.mp3";
import dialTone from "../assets/dial_tone.mp3";

import { SocketContext } from "../SocketContext";

export default function Notifications() {
  const { answerCall, call, callAccepted, callOutgoing } = useContext(
    SocketContext
  );
  return (
    <>
      {callOutgoing ? <audio src={dialTone} autoPlay loop></audio> : <></>}
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>{call.name} is Calling</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
          <audio src={ringTone} autoPlay loop></audio>
        </div>
      )}
    </>
  );
}
