"use client";

import { socket } from "@/components/socket";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import s from "./index.module.scss";

type Message = {
  user: string;
  message: string;
};

const Index = ({ roomName }: { roomName: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const messagesRef = useRef<HTMLDivElement>(null);
  const [selfMessage, setSelfMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const leaveRoom = () => {
    socket.emit("leave-room", roomName);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      leaveRoom();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomName]);

  useEffect(() => {
    if (pathname !== `/room/${roomName}`) {
      leaveRoom();
    }
  }, [roomName, pathname]);

  const handleMessage = ({ user, message }: Message) => {
    setMessages((prevMes) => [...prevMes, { user, message }]);
  };

  useEffect(() => {
    socket.on("chat message", handleMessage);
    socket.emit("get-chat-history", roomName);

    socket.on("chat history", (msg) => {
      setMessages(msg);
    });

    return () => {
      socket.off("chat message", handleMessage);
      socket.off("chat history", handleMessage);
    };
  }, [selfMessage]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
    }
  }, [messages]);

  const submitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selfMessage.trim() !== "") {
      socket.emit("chat message", { message: selfMessage, roomName });
      setSelfMessage("");
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("/rooms");
  };

  return (
    <div>
      <div className={`${s.chat__header} flex justify-between`}>
        <div className={s.chat__header__title}>
          This is private chat room: {roomName}
        </div>
        <button onClick={handleLeaveRoom}>Leave Room</button>
      </div>

      <div ref={messagesRef} className={s.chat__content}>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.user}: {message.message}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={submitMessage} className={s.form__chat}>
        <input
          autoComplete='off'
          type='text'
          value={selfMessage}
          onChange={(e) => setSelfMessage(e.target.value)}
        />
        <button type='submit'>send</button>
      </form>
    </div>
  );
};
export default Index;
