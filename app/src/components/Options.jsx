import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone, PhoneDisabled } from "@material-ui/icons";

import { SocketContext } from "../SocketContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  gridContainer: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  container: {
    width: "600px",
    margin: "35px 0",
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  button: {
    marginTop: 20,
    color: "var(--theme-primary-text)",
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: "10px 20px",
    borderRadius: "10px",
    backgroundColor: "var(--theme-primary-background)",
    color: "var(--theme-primary-text)",
  },
}));

export default function Options({ children }) {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    callOutgoing,
  } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");
  const classes = useStyles();

  const handleNameChange = (value) => {
    localStorage.setItem("name", value);
    setName(value);
  };

  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography
                style={{
                  fontSize: "1.3rem",
                  fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                  fontWeight: "bold",
                }}
                gutterBottom
                variant="h3"
              >
                Your Info
              </Typography>
              <TextField
                label="Name"
                value={localStorage.getItem("name") || name}
                onChange={(e) => handleNameChange(e.target.value)}
                fullWidth
                disabled={callAccepted && !callEnded}
              />
              <CopyToClipboard text={me} className={classes.button}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Assignment fontSize="large" />}
                >
                  Copy Your ID
                </Button>
              </CopyToClipboard>
              <Typography
                style={{
                  fontSize: "0.75rem",
                  fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                  fontWeight: "400",
                  lineHeight: "2.66",
                  letterSpacing: "0.08333em",
                }}
                gutterBottom
                variant="body1"
              >
                ID: {me}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography
                style={{
                  fontSize: "1.3rem",
                  fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                  fontWeight: "bold",
                }}
                gutterBottom
                variant="h3"
              >
                Make a call
              </Typography>
              <TextField
                label="ID to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                fullWidth
              />
              {(callAccepted && !callEnded) || callOutgoing ? (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PhoneDisabled fontSize="large" />}
                  fullWidth
                  onClick={() => leaveCall(idToCall)}
                  className={classes.button}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Phone fontSize="large" />}
                  fullWidth
                  onClick={() => callUser(idToCall)}
                  className={classes.button}
                >
                  Call
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
}
