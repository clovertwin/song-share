"use client";
import { Session } from "next-auth";
import PlaylistLayout from "../components/PlaylistLayout";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { searchOpenState } from "../atoms/searchAtom";
import { useSetRecoilState, useRecoilState } from "recoil";
import Search from "../components/Search";
import { artistComponentOpenState } from "../atoms/artistAtom";
import { useEffect } from "react";
import { albumComponentOpenState } from "../atoms/albumAtom";
import { showComponentOpenState } from "../atoms/showAtom";

interface Props {
  session: Session | null;
}

export default function Home({ session }: Props) {
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const setArtistComponentOpen = useSetRecoilState(artistComponentOpenState);
  const setAlbumComponentOpen = useSetRecoilState(albumComponentOpenState);
  const setShowComponentOpen = useSetRecoilState(showComponentOpenState);

  useEffect(() => {
    setSearchOpen(false);
    setArtistComponentOpen(false);
    setAlbumComponentOpen(false);
    setShowComponentOpen(false);
  }, [
    setSearchOpen,
    setArtistComponentOpen,
    setAlbumComponentOpen,
    setShowComponentOpen,
  ]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex flex-col-reverse h-full sm:flex-row">
        <Sidebar session={session} />
        {searchOpen ? (
          <Search session={session} />
        ) : (
          <PlaylistLayout session={session} />
        )}
      </main>
      <div className="fixed bottom-0 w-full">
        <Player session={session} />
      </div>
    </div>
  );
}
