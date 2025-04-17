import { roomArray, roomArrayToClient, roomMessages } from "../consts.js";
import type { TypeSocket, TypeServer } from "../../serverTypes/types.ts";
import type { RoomType } from "../../types/roomType.jsx";

export const addRoom = (io: TypeServer, socket: TypeSocket) => {
  socket.on("add-room", (info: RoomType) => {
    socket.join(info.roomName);

    const idRoom = io.sockets.adapter.rooms
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
};
