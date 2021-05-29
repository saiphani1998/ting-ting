const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const path = require("path");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["Get", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + "/app/dist/build"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/app/build/index.html");
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + `/app/build/${req.originalUrl}`));
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    // socket.broadcast.emit("endCall");
  });

  socket.on("calluser", ({ recepient, signalData, from, name }) => {
    io.to(recepient).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", {
      signal: data.signal,
      name: data.name,
    });
  });

  socket.on("declineCall", (data) => {
    console.log("Decline Call");
    io.to(data.to).emit("callDeclined", {
      signal: data.signal,
      name: data.name,
    });
    io.to(data.me).emit("declineReceived");
  });

  socket.on("endCall", ({ recepient }) => {
    console.log("End Call", recepient);
    io.to(recepient).emit("endCall");
  });

  socket.on("toggleAudio", ({ recepient, from }) => {
    io.to(recepient).emit("toggleAudio");
  });
});

server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
