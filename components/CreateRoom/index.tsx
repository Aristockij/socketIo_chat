"use client";

import { useEffect, useState } from "react";
import { socket } from "@/components/socket";
import RoomEl from "@/components/RoomEl";
import { Room } from "@/types/roomType";
import { useRouter } from "next/navigation";
import s from "./index.module.scss";
const Index = () => {
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);

  const router = useRouter();

  useEffect(() => {
    const handleUpdateRoom = (newRooms: Room[]) => {
      setRooms(newRooms);
    };
    socket.on("update-room", handleUpdateRoom);

    return () => {
      socket.off("update-room", handleUpdateRoom);
    };
  }, []);

  const createRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("add-room", { roomName: roomName, pass: roomPass });
    socket.on("get-id-room", () => {
      router.push(`room/${roomName}`);
    });
  };

  return (
    <section>
      {rooms.length > 0 && (
        <div className={s.rooms__list}>
          <ul>
            {rooms.map((el, index) => (
              <RoomEl key={index} el={el} />
            ))}
          </ul>
        </div>
      )}
      <form action='' onSubmit={createRoom} className={`${s.rooms__form} form`}>
        <input
          type='text'
          id='room-name'
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type='text'
          id='room-pass'
          onChange={(e) => setRoomPass(e.target.value)}
        />
        <button type='submit'>create</button>
      </form>
    </section>
  );
};
export default Index;
