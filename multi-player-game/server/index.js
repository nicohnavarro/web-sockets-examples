const { createServer } = require("http");
const { Server } = require("socket.io");

const playerScores = [];
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("score", (score) => {
    playerScores.push({ ...score, id: socket.id });
    socket.emit("playerScores", playerScores);

    setInterval(() => {
      socket.emit("playerScores", playerScores);
    }, 5000);
  });
});

httpServer.listen(3000, () => console.log("Server is connected! 🔌"));
