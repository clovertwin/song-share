"use client";
import { Session } from "next-auth";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { searchOpenState } from "../atoms/searchAtom";
import { useRecoilState } from "recoil";
import Search from "../components/Search";
import { artistComponentOpenState } from "../atoms/artistAtom";
import ArtistLayout from "../components/ArtistLayout";
import { useEffect } from "react";
import { albumComponentOpenState } from "../atoms/albumAtom";
import AlbumLayout from "../components/AlbumLayout";
import { songComponentOpenState } from "../atoms/searchSelectedSong";
import SongLayout from "../components/SongLayout";

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
  const [songComponentOpen, setSongComponentOpen] = useRecoilState(
    songComponentOpenState
  );

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
        ) : artistComponentOpen ? (
          <ArtistLayout session={session} />
        ) : albumComponentOpen ? (
          <AlbumLayout session={session} />
        ) : songComponentOpen ? (
          <SongLayout session={session} />
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
