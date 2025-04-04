"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/components/socket";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const username = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];

    if (username) {
      socket.auth = { username };
      socket.connect();

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        alert("Failed to connect to the server. Please try again later.");
      });
    } else {
      router.push("/");
    }
  }, [router]);

  return <section className={"container"}>{children}</section>;
};
export default Provider;
