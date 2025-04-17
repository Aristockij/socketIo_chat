import { roomMessages } from "../consts.js";
import type { TypeSocket, TypeServer } from "../../serverTypes/types.ts";

export const chatMessage = (io: TypeServer, socket: TypeSocket) => {
  socket.on("chat message", (msg) => {
    const newMessage = { user: socket.data.username, message: msg.message };

    if (!roomMessages[msg.roomName]) {
      roomMessages[msg.roomName] = [];
    }

    roomMessages[msg.roomName].push(newMessage);

    io.to(msg.roomName).emit("chat message", newMessage);
  });
};
