import type { TypeSocket, TypeServer } from "../../serverTypes/types.ts";

export const getUsersInRoom = (io: TypeServer, socket: TypeSocket) => {
  socket.on("get-users-in-room", (roomName) => {
    const userInRoom = io.sockets.adapter.rooms.get(roomName)?.size || 0;

    socket.emit("get-users", userInRoom);
  });
};
