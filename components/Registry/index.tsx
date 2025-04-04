"use client";

import { useState } from "react";
import { socket } from "@/components/socket";
import { useRouter } from "next/navigation";

const Index = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (username.length !== 0) {
      e.preventDefault();
      document.cookie = `username=${encodeURIComponent(
        username
      )}; path=/; max-age=3600`;

      socket.auth = { username };
      socket.connect();
      router.push("/rooms");
    }
  };

  return (
    <div className={"h-[100vh] flex justify-center items-center"}>
      <form action='' className='form w-[500px]' onSubmit={onSubmit}>
        <input type='text' onChange={(e) => setUsername(e.target.value)} />
        <button>registry</button>
      </form>
    </div>
  );
};
export default Index;
