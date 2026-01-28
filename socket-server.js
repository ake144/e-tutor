// Simple Socket.io server for local chat testing
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("chat:send", (msg) => {
    io.emit("chat:message", msg);
  });
});

server.listen(4000, () => {
  console.log("Socket.io server running on http://localhost:4000");
});
