"use client";
import { Session } from "next-auth";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { searchSelectedState } from "../atoms/searchAtom";
import { useRecoilValue } from "recoil";
import Search from "../components/Search";

interface Props {
  session: Session | null;
}

export default function Home({ session }: Props) {
  const searchSelected = useRecoilValue(searchSelectedState);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar session={session} />
        {searchSelected ? (
          <Search session={session} />
        ) : (
          <Center session={session} />
        )}
      </main>
      <div className="sticky bottom-0">
        <Player session={session} />
      </div>
    </div>
  );
}
