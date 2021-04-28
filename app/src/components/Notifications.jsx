import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import ringTone from "../assets/ring_ring.mp3";
import dialTone from "../assets/dial_tone.mp3";

import { SocketContext } from "../SocketContext";

export default function Notifications() {
  const { answerCall, call, callAccepted, callOutgoing } = useContext(
    SocketContext
  );

  const setVolume = (element, volume) => {
    element.volume = volume;
  };

  const ringtoneVolumeSetter = () => {
    const element = document.getElementById("ringTone");
    console.log(element);
    setVolume.apply(this, [element, 0.05]);
  };

  const dialToneVolumeSetter = () => {
    const element = document.getElementById("dialTone");
    console.log(element);
    setVolume.apply(this, [element, 0.2]);
  };

  return (
    <>
      {callOutgoing ? (
        setTimeout(() => dialToneVolumeSetter(), 0) && (
          <audio id="dialTone" src={dialTone} autoPlay loop></audio>
        )
      ) : (
        <></>
      )}
      {call.isReceivingCall &&
        !callAccepted &&
        setTimeout(() => ringtoneVolumeSetter(), 0) && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h1>{call.name} is Calling</h1>
            <Button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </Button>
            <audio id="ringTone" src={ringTone} autoPlay loop></audio>
          </div>
        )}
    </>
  );
}
