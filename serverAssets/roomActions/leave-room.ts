import { roomArray, roomMessages, roomArrayToClient } from "../consts.js";
import type { TypeSocket, TypeServer } from "../../serverTypes/types.ts";

export const leaveRoom = (io: TypeServer, socket: TypeSocket) => {
  socket.on("leave-room", (roomName) => {
    if (socket.rooms.has(roomName)) {
      socket.leave(roomName);
      console.log(`${socket.data.username} left room: ${roomName}`);

      io.to(roomName).emit("user-left", {
        user: socket.data.username,
        roomName,
      });

      const room = io.sockets.adapter.rooms.get(roomName);
      const usersInRoom = Array.from(
        io.sockets.adapter.rooms.get(roomName) || []
      ).map((socketId) => io.sockets.sockets.get(socketId)?.data.username);

      io.to(roomName).emit("update-users", {
        roomName,
        count: usersInRoom.length,
      });

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
};
