export type RoomType = {
  roomName: string;
  isLocked: boolean;
  idRoom: string | undefined;
  pass?: string;
};

export type TypeRoomMessage = {
  message: string;
  roomName: string;
};

export type TypeNewMessage = {
  user: string;
  message: string;
};
export interface RoomMessageType {
  [key: string]: TypeNewMessage[];
}
