const Koa = require("koa");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log("connect success");
  socket.on("ready", () => {
    // console.log("ready");
    socket.broadcast.emit("ready");
  });

  socket.on("offer", (params) => {
    console.log("offer", params);
    socket.broadcast.emit("offer", params);
  });

  socket.on("answer", (params) => {
    socket.broadcast.emit("answer", params);
  });

  socket.on("toCustomCandidate", (params) => {
    socket.broadcast.emit("toCustomCandidate", params);
  });

  socket.on("toUserCandidate", (params) => {
    socket.broadcast.emit("toUserCandidate", params);
  });

  socket.on("mousemove", (params) => {
    socket.broadcast.emit("mousemove", params);
  });
});

httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
