"use client";
import { Session } from "next-auth";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";

interface Props {
  session: Session | null;
}

export default function Home({ session }: Props) {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar session={session} />
        <Center session={session} />
      </main>
      <div className="sticky bottom-0 py-5 w-full bg-black text-center">
        <Player />
      </div>
    </div>
  );
}
