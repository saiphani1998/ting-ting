import React from "react";
import { Typography, AppBar, Toolbar } from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";

import VideoPlayer from "./components/VideoPlayer";
import Notifications from "./components/Notifications";
import Options from "./components/Options";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#67daff",
      main: "#03a9f4",
      dark: "#007ac1",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffa270",
      main: "#ff7043",
      dark: "#c63f17",
      contrastText: "#fff",
    },
  },
});

const useStyles = makeStyles(() => ({
  appBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginLeft: "15px",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
  },
  footer: {
    backgroundColor: "#333",
    color: "white",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  content: {
    flexGrow: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.wrapper}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h5">
              Ting Ting
              <Typography variant="caption">
                {" "}
                -- The Video Calling App
              </Typography>
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <VideoPlayer />
          <Options>
            <Notifications />
          </Options>
        </div>
        <div className={classes.footer}>
          <span>
            Made with ❤️ by{" "}
            <a
              style={{ color: "#03a9f4", textDecoration: "none" }}
              href="https://www.linkedin.com/in/saiphani1998/"
            >
              Phani
            </a>
          </span>
        </div>
      </div>
    </ThemeProvider>
  );
}
