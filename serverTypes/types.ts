import { Server, Socket } from "socket.io";
import type {
  RoomType,
  TypeNewMessage,
  TypeRoomMessage,
} from "../types/roomType";

export interface ServerToClientEvents {
  "update-room": (a: RoomType[]) => void;
  "get-id-room": (a: string | undefined) => void;
  "chat message": (a: TypeNewMessage) => void;
  "chat history": (a: TypeNewMessage[]) => void;
  "update-users": (a: { roomName: string; count: number }) => void;
  "password-correct": () => boolean;
  "password-incorrect": () => boolean;
  "get-users": (a: number) => void;
  "user-left": (a: { user: string; roomName: string }) => void;
}

export interface ClientToServerEvents {
  "add-room": (a: RoomType) => void;
  "chat message": (a: TypeRoomMessage) => void;
  "check-password-room": (idRoom: string | undefined, pass: string) => void;
  "get-chat-history": (a: string) => void;
  "get-users-in-room": (a: string) => void;
  "leave-room": (a: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
  age: number;
}

export type TypeSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type TypeServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
