import { Grid, IconButton, makeStyles, Typography } from "@material-ui/core";
import {
  FlipCameraIos,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@material-ui/icons";
import React, { useContext } from "react";
import { SocketContext } from "../SocketContext";

const useStyles = makeStyles(() => ({
  grid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    textTransform: "uppercase",
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },
}));

export default function VideoOptions() {
  const {
    name,
    changeCamera,
    toggleVideo,
    toggleAudio,
    audioEnabled,
    videoEnabled,
  } = useContext(SocketContext);
  const classes = useStyles();

  return (
    <Grid container direction="row">
      <Grid item md={3} xs={3} className={classes.grid}>
        <Typography
          variant="body1"
          color="secondary"
          className={classes.userName}
        >
          <b>{name || "You"}</b>
        </Typography>
      </Grid>
      <Grid item md={9} xs={9} className={classes.grid}>
        <IconButton
          onClick={() => changeCamera()}
          aria-label="Change Camera"
          color="secondary"
        >
          <FlipCameraIos />
        </IconButton>
        <IconButton
          onClick={() => toggleVideo()}
          aria-label="Toggle Camera"
          color="secondary"
        >
          {videoEnabled ? <VideocamOff /> : <Videocam />}
        </IconButton>
        <IconButton
          onClick={() => toggleAudio()}
          aria-label="Toggle Mic"
          color="secondary"
        >
          {audioEnabled ? <MicOff /> : <Mic />}
        </IconButton>
      </Grid>
    </Grid>
  );
}
