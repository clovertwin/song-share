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
import { songComponentOpenState } from "../atoms/searchSelectedSong";

interface Props {
  session: Session | null;
}

export default function Home({ session }: Props) {
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const setArtistComponentOpen = useSetRecoilState(artistComponentOpenState);
  const setAlbumComponentOpen = useSetRecoilState(albumComponentOpenState);
  const setSongComponentOpen = useSetRecoilState(songComponentOpenState);

  useEffect(() => {
    setSearchOpen(false);
    setArtistComponentOpen(false);
    setAlbumComponentOpen(false);
    setSongComponentOpen(false);
  }, [
    setSearchOpen,
    setArtistComponentOpen,
    setAlbumComponentOpen,
    setSongComponentOpen,
  ]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar session={session} />
        {searchOpen ? (
          <Search session={session} />
        ) : (
          <PlaylistLayout session={session} />
        )}
      </main>
      <div className="sticky bottom-0">
        <Player session={session} />
      </div>
    </div>
  );
}
