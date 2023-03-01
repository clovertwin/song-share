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
import { playlistIdState } from "../atoms/playlistAtom";
import { searchOpenState } from "../atoms/searchAtom";
import useSpotify from "../hooks/useSpotify";

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
  };

  return (
    <div className="text-gray-500 pt-5 px-2 pb-16 text-xs border-r-gray-900 scrollbar-hide w-full sm:pb-36 sm:w-auto sm:h-screen sm:max-w-[12rem] sm:overflow-y-scroll md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="bg-gray-900 rounded-md p-1 space-y-0 flex justify-around items-center w-full sm:bg-inherit sm:space-x-0 sm:w-auto sm:space-y-4 sm:block">
        <button
          onClick={() => setSearchOpen(false)}
          className="flex flex-col items-center space-x-0 sm:space-x-2 sm:flex-row hover:text-white"
        >
          <HomeIcon className="h-6 w-6 sm:h-5 sm:w-5" />
          <p className="text-[.65rem] sm:text-base">Home</p>
        </button>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex flex-col items-center space-x-0 sm:space-x-2 sm:flex-row hover:text-white"
        >
          <MagnifyingGlassIcon className="h-6 w-6 sm:h-5 sm:w-5" />
          <p className="text-[.65rem] sm:text-base">Search</p>
        </button>
        <button className="flex flex-col items-center space-x-0 sm:space-x-2 sm:flex-row hover:text-white">
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
              className="cursor-pointer hover:text-white"
            >
              {playlist.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
