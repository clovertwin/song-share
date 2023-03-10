import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { albumComponentOpenState } from "../atoms/albumAtom";
import { artistComponentOpenState } from "../atoms/artistAtom";
import {
  playListComponentOpenState,
  playlistIdState,
} from "../atoms/playlistAtom";
import { searchOpenState } from "../atoms/searchAtom";
import useSpotify from "../hooks/useSpotify";
import { libraryComponentOpenState } from "../atoms/libraryAtom";
import { showComponentOpenState } from "../atoms/showAtom";
import { homeOpenState } from "../atoms/homeAtom";

interface Props {
  session: Session | null;
}

export default function Sidebar({ session }: Props) {
  const spotifyApi = useSpotify(session);
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const setPlaylistId = useSetRecoilState(playlistIdState);
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const setArtistComponentOpen = useSetRecoilState(artistComponentOpenState);
  const setAlbumComponentOpen = useSetRecoilState(albumComponentOpenState);
  const setShowComponentOpen = useSetRecoilState(showComponentOpenState);
  const setLibraryOpen = useSetRecoilState(libraryComponentOpenState);
  const setHomeOpen = useSetRecoilState(homeOpenState);
  const setPlaylistComponentOpen = useSetRecoilState(
    playListComponentOpenState
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [spotifyApi, session]);

  const handlePlaylistSelect = (
    playlist: SpotifyApi.PlaylistObjectSimplified
  ) => {
    setPlaylistId(playlist.id);
    setSearchOpen(false);
    setArtistComponentOpen(false);
    setAlbumComponentOpen(false);
    setShowComponentOpen(false);
    setLibraryOpen(false);
    setPlaylistComponentOpen(true);
  };

  return (
    <div className="text-gray-500 bg-black pt-5 px-2 pb-16 text-xs border-r-gray-900 scrollbar-hide w-full sm:pb-36 sm:h-screen sm:overflow-y-scroll md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="bg-gray-900 rounded-md p-1 space-y-0 flex justify-around items-center truncate w-full sm:bg-inherit sm:space-x-0 sm:w-auto sm:space-y-4 sm:block">
        <button
          onClick={() => {
            setSearchOpen(false);
            setLibraryOpen(false);
            setPlaylistComponentOpen(false);
            setHomeOpen(true);
          }}
          className="flex flex-col items-center space-x-0 sm:space-x-2 sm:flex-row hover:text-white"
        >
          <HomeIcon className="h-5 w-5 sm:h-5 sm:w-5" />
          <p>Home</p>
        </button>
        <button
          onClick={() => {
            setSearchOpen(!searchOpen);
            setLibraryOpen(false);
            setPlaylistComponentOpen(false);
          }}
          className="flex flex-col items-center space-x-0 sm:space-x-2 sm:flex-row hover:text-white"
        >
          <MagnifyingGlassIcon className="h-5 w-5 sm:h-5 sm:w-5" />
          <p>Search</p>
        </button>
        <button
          onClick={() => {
            setSearchOpen(false);
            setPlaylistComponentOpen(false);
            setLibraryOpen((prev) => !prev);
          }}
          className="flex flex-col items-center space-x-0 sm:space-x-2 sm:flex-row hover:text-white"
        >
          <BuildingLibraryIcon className="h-5 w-5" />
          <p>Library</p>
        </button>
        <hr className="hidden sm:block sm:border-t-[0.1px] sm:border-gray-900" />
        {/* Playlists */}
        <div className="hidden sm:block space-y-4">
          {playlists.map((playlist) => (
            <p
              key={playlist.id}
              onClick={() => handlePlaylistSelect(playlist)}
              className="cursor-pointer hover:text-white truncate"
            >
              {playlist.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
