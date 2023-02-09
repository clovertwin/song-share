import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
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
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);

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
  };

  return (
    <div className="hidden text-gray-500 p-5 pb-36 text-xs border-r-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex items-center space-x-2 hover:text-white"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BuildingLibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>CreatePlaylist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists */}
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
  );
}
