"use client";
import { useSession, signOut } from "next-auth/react";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div>{/* song player */}</div>
    </div>
  );
}
