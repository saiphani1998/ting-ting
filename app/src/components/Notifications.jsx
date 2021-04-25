import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import ring_ring from "../assets/ring_ring.mp3";

import { SocketContext } from "../SocketContext";

export default function Notifications() {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>{call.name} is Calling</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
          <audio id="caller-tune" src={ring_ring} autoPlay loop></audio>
        </div>
      )}
    </>
  );
}
