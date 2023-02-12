"use client";
import { Session } from "next-auth";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { searchOpenState } from "../atoms/searchAtom";
import { useRecoilState } from "recoil";
import Search from "../components/Search";
import { artistComponentOpenState } from "../atoms/artistAtom";
import Artist from "../components/Artist";
import { useEffect } from "react";
import { albumComponentOpenState } from "../atoms/albumAtom";
import Album from "../components/Album";

interface Props {
  session: Session | null;
}

export default function Home({ session }: Props) {
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const [artistComponentOpen, setArtistComponentOpen] = useRecoilState(
    artistComponentOpenState
  );
  const [albumComponentOpen, setAlbumComponentOpen] = useRecoilState(
    albumComponentOpenState
  );

  useEffect(() => {
    setSearchOpen(false);
    setArtistComponentOpen(false);
    setAlbumComponentOpen(false);
  }, [setSearchOpen, setArtistComponentOpen, setAlbumComponentOpen]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar session={session} />
        {searchOpen ? (
          <Search session={session} />
        ) : artistComponentOpen ? (
          <Artist session={session} />
        ) : albumComponentOpen ? (
          <Album session={session} />
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
