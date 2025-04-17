import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { roomArrayToClient } from "./serverAssets/consts.js";

import { addRoom } from "./serverAssets/roomActions/add-room";
import { checkPassword } from "./serverAssets/roomActions/check-password-room";
import { getUsersInRoom } from "./serverAssets/roomActions/get-users-in-room";
import { chatMessage } from "./serverAssets/roomActions/chat-message";
import { getChatHistory } from "./serverAssets/roomActions/get-chat-history";
import { leaveRoom } from "./serverAssets/roomActions/leave-room";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  TypeSocket,
} from "./serverTypes/types.ts";

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer);

  io.use((socket: TypeSocket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.data.username = username;
    next();
  });

  io.on("connection", (socket: TypeSocket) => {
    io.emit("update-room", roomArrayToClient);

    addRoom(io, socket);
    checkPassword(io, socket);
    getUsersInRoom(io, socket);
    chatMessage(io, socket);
    getChatHistory(socket);
    leaveRoom(io, socket);

    socket.on("disconnect", () => {
      console.log(socket.data.username, "disconnected");
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
