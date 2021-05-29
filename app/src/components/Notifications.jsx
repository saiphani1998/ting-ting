import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import ringTone from "../assets/ring_ring.mp3";
import dialTone from "../assets/dial_tone.mp3";

import { SocketContext } from "../SocketContext";
import { Call, CallEnd, CallMissed } from "@material-ui/icons";

export default function Notifications() {
  const {
    answerCall,
    declineCall,
    call,
    callAccepted,
    callDeclined,
    callOutgoing,
    callEnded,
  } = useContext(SocketContext);

  const [incomingNotificationOpen, setIncomingNotificationOpen] =
    useState(false);
  const [rejectNotificationOpen, setRejectNotificationOpen] = useState(false);

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted && !callEnded) {
      setIncomingNotificationOpen(true);
    } else {
      setIncomingNotificationOpen(false);
    }
  }, [call.isReceivingCall, callAccepted, callEnded]);

  useEffect(() => {
    if (callDeclined) {
      setRejectNotificationOpen(true);
    } else {
      setRejectNotificationOpen(false);
    }
  }, [callDeclined]);

  const setVolume = (element, volume) => {
    element.volume = volume;
  };

  const ringtoneVolumeSetter = () => {
    const element = document.getElementById("ringTone");
    if (element) {
      setVolume.apply(this, [element, 0.05]);
    }
  };

  const dialToneVolumeSetter = () => {
    const element = document.getElementById("dialTone");
    if (element) {
      setVolume.apply(this, [element, 0.2]);
    }
  };

  const incomingNotification = (
    <Dialog
      open={incomingNotificationOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Incoming Call"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {call.name} is Calling
        </DialogContentText>
        <audio id="ringTone" src={ringTone} autoPlay loop></audio>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={declineCall} color="secondary">
          <CallEnd /> Decline
        </Button>
        <Button
          variant="contained"
          onClick={answerCall}
          color="primary"
          autoFocus
        >
          <Call /> Answer
        </Button>
      </DialogActions>
    </Dialog>
  );

  const rejectNotification = (
    <Dialog
      open={rejectNotificationOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Call Rejected"}</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          color="secondary"
          autoFocus
        >
          <CallMissed /> Return
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      {callOutgoing ? (
        setTimeout(() => dialToneVolumeSetter(), 0) && (
          <audio id="dialTone" src={dialTone} autoPlay loop></audio>
        )
      ) : (
        <></>
      )}
      {incomingNotificationOpen &&
        setTimeout(() => ringtoneVolumeSetter(), 0) &&
        incomingNotification}
      {rejectNotificationOpen && rejectNotification}
    </>
  );
}
