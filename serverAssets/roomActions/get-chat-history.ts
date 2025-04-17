import { roomMessages } from "../consts.js";
import type { TypeSocket } from "../../serverTypes/types.ts";

export const getChatHistory = (socket: TypeSocket) => {
  socket.on("get-chat-history", (roomName) => {
    socket.emit("chat history", roomMessages[roomName]);
  });
};
