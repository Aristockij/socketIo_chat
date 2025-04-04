import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });

  const roomArray = [];
  const roomArrayToClient = [];
  const roomMessages = {};

  io.on("connection", (socket) => {
    io.emit("update-room", roomArrayToClient);

    socket.on("add-room", (info) => {
      socket.join(info.roomName);

      let idRoom = socket.adapter.rooms
        .get(info.roomName)
        ?.values()
        .next().value;

      socket.emit("get-id-room", idRoom);

      roomArray.push({
        ...info,
        idRoom: idRoom,
      });

      roomArrayToClient.push({
        roomName: info.roomName,
        isLocked: info.pass ? true : false,
        idRoom: idRoom,
      });

      roomMessages[info.roomName] = [];

      io.emit("update-room", roomArrayToClient);
    });

    socket.on("check-password-room", (idRoom, pass) => {
      const room = roomArray.find((room) => room.idRoom === idRoom);
      if (room.pass === pass) {
        socket.join(room.roomName);
        console.log(`${socket.username} joined room: ${room.roomName}`);

        const userInRoom =
          io.sockets.adapter.rooms.get(room.roomName)?.size || 0;
        console.log("user in room: ", userInRoom);

        if (roomMessages[room.roomName]) {
          socket.emit("chat history", roomMessages[room.roomName]);
        }

        io.to(room.roomName).emit("update-users", {
          roomName: room.roomName,
          count: userInRoom,
        });

        socket.emit("password-correct");
      } else {
        socket.emit("password-incorrect");
      }
    });

    socket.on("get-users-in-room", (roomName) => {
      const userInRoom = io.sockets.adapter.rooms.get(roomName)?.size || 0;

      socket.emit("get-users", userInRoom);
    });

    socket.on("chat message", (msg) => {
      const newMessage = { user: socket.username, message: msg.message };

      if (!roomMessages[msg.roomName]) {
        roomMessages[msg.roomName] = [];
      }

      roomMessages[msg.roomName].push(newMessage);

      io.to(msg.roomName).emit("chat message", newMessage);
    });

    socket.on("get-chat-history", (roomName) => {
      socket.emit("chat history", roomMessages[roomName]);
    });

    socket.on("leave-room", (roomName) => {
      if (socket.rooms.has(roomName)) {
        socket.leave(roomName);
        console.log(`${socket.username} left room: ${roomName}`);

        io.to(roomName).emit("user-left", { user: socket.username, roomName });

        const room = io.sockets.adapter.rooms.get(roomName);
        const usersInRoom = Array.from(
          io.sockets.adapter.rooms.get(roomName) || []
        ).map((socketId) => io.sockets.sockets.get(socketId).username);

        io.to(roomName).emit("update-users", usersInRoom);

        if (!room || room.size === 0) {
          console.log(`Room ${roomName} is empty. Deleting...`);

          const roomIndex = roomArray.findIndex((r) => r.roomName === roomName);
          if (roomIndex !== -1) {
            roomArray.splice(roomIndex, 1);
          }

          delete roomMessages[roomName];
          const roomIndexToClient = roomArrayToClient.findIndex(
            (r) => r.roomName === roomName
          );

          if (roomIndexToClient !== -1) {
            roomArrayToClient.splice(roomIndexToClient, 1);
          }

          io.emit("update-room", roomArrayToClient);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(socket.username, "disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
