import { roomArray, roomMessages } from "../consts.js";
import type { TypeSocket, TypeServer } from "../../serverTypes/types.ts";
import type { RoomType } from "../../types/roomType.ts";

export const checkPassword = (io: TypeServer, socket: TypeSocket) => {
  socket.on("check-password-room", (idRoom, pass) => {
    const room: RoomType | undefined = roomArray.find(
      (room) => room.idRoom === idRoom
    );
    if (room && room.pass === pass) {
      socket.join(room.roomName);
      console.log(`${socket.data.username} joined room: ${room.roomName}`);

      const userInRoom = io.sockets.adapter.rooms.get(room.roomName)?.size || 0;
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
};
