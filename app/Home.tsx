"use client";
import { Session } from "next-auth";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";

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
      <div>{/* song player */}</div>
    </div>
  );
}
