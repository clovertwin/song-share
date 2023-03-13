"use client";
import { Session } from "next-auth";
import PlaylistLayout from "../components/PlaylistLayout";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import Library from "../components/Library";
import HomeComponent from "../components/HomeComponent";
import { searchOpenState } from "../atoms/searchAtom";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import Search from "../components/Search";
import { artistComponentOpenState } from "../atoms/artistAtom";
import { useEffect } from "react";
import { albumComponentOpenState } from "../atoms/albumAtom";
import { showComponentOpenState } from "../atoms/showAtom";
import { libraryComponentOpenState } from "../atoms/libraryAtom";
import { playListComponentOpenState } from "../atoms/playlistAtom";
import { homeOpenState } from "../atoms/homeAtom";

interface Props {
  session: Session | null;
}

export default function Home({ session }: Props) {
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const setArtistComponentOpen = useSetRecoilState(artistComponentOpenState);
  const setAlbumComponentOpen = useSetRecoilState(albumComponentOpenState);
  const setShowComponentOpen = useSetRecoilState(showComponentOpenState);
  const [homeOpen, setHomeOpen] = useRecoilState(homeOpenState);
  const [libraryOpen, setLibraryOpen] = useRecoilState(
    libraryComponentOpenState
  );
  const [playlistComponentOpen, setPlaylistComponentOpen] = useRecoilState(
    playListComponentOpenState
  );

  useEffect(() => {
    setSearchOpen(false);
    setArtistComponentOpen(false);
    setAlbumComponentOpen(false);
    setShowComponentOpen(false);
    setLibraryOpen(false);
    setHomeOpen(true);
  }, [
    setSearchOpen,
    setArtistComponentOpen,
    setAlbumComponentOpen,
    setShowComponentOpen,
    setLibraryOpen,
    setHomeOpen,
  ]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex flex-col-reverse h-full sm:flex-row">
        <div className="fixed bottom-0 w-full sm:w-40 sm:block sm:relative">
          <Sidebar session={session} />
        </div>
        {searchOpen ? (
          <Search session={session} />
        ) : libraryOpen ? (
          <Library session={session} />
        ) : playlistComponentOpen ? (
          <PlaylistLayout session={session} />
        ) : (
          <HomeComponent session={session} />
        )}
      </main>
      <div className="fixed bottom-0 w-full">
        <Player session={session} />
      </div>
    </div>
  );
}
