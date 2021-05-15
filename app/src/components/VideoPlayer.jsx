import React, { useContext } from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { SocketContext } from "../SocketContext";
import VideoOptions from "./VideoOptions";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.up("md")]: {
      minHeight: "480px",
      height: "fit-content",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      display: "grid",
      justifyContent: "center",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    margin: "10px",
    backgroundColor: "var(--theme-primary-background)",
    textAlign: "center",
  },
  videoGrid: {
    [theme.breakpoints.down("xs")]: {
      display: "grid",
      justifyContent: "center",
    },
  },
}));

export default function VideoPlayer() {
  const { callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6} className={classes.videoGrid}>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
          {callAccepted && !callEnded && <VideoOptions />}
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6} className={classes.videoGrid}>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className={classes.video}
              id="userVideo"
            />
          </Grid>
          <Typography variant="overline" gutterBottom>
            <b>{call.name || "Other User"}</b>
          </Typography>
        </Paper>
      )}
    </Grid>
  );
}
