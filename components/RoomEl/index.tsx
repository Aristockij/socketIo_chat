"use client";

import { useState, useEffect } from "react";
import { socket } from "@/components/socket";
import { useRouter } from "next/navigation";
import { RoomType } from "@/types/roomType";

const Index = ({ el }: { el: RoomType }) => {
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [countUsers, setCountUsers] = useState(0);

  const router = useRouter();

  useEffect(() => {
    socket.emit("get-users-in-room", el.roomName);
    socket.on("get-users", (users) => {
      console.log(users);
      setCountUsers(users);
    });
  }, []);

  const joinRoom = (idRoom: string, password: string) => {
    socket.emit("check-password-room", idRoom, password);

    socket.once("password-correct", () => {
      console.log("password-correct");
      router.push(`room/${el.roomName}`);
    });
    socket.once("password-incorrect", () => {
      console.log("password-incorrect");
      alert("Password is incorrect");
    });
  };

  const openPrivateRoom = (elem: { roomName: string }) => {
    router.push(`room/${elem.roomName}`);
  };

  return (
    <li
      onClick={() => {
        if (el.isLocked) {
          setOpenPopup(true);
        } else {
          openPrivateRoom(el);
        }
      }}
    >
      <div className='flex justify-between'>
        <div>{el.roomName}</div>
        <div className='flex items-center gap-2'>
          {countUsers} {el.isLocked && <div>🔐</div>}
        </div>
      </div>
      {isOpenPopup && (
        <form
          action=''
          className='form'
          onSubmit={(e) => {
            e.preventDefault();
            if (el.idRoom) joinRoom(el.idRoom, password);
          }}
        >
          <input
            type='text'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button>join</button>
        </form>
      )}
    </li>
  );
};

export default Index;
