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
    <div className="hidden text-gray-500 p-5 pb-36 text-xs border-r-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4">
        <button
          onClick={() => setSearchOpen(false)}
          className="flex items-center space-x-2 hover:text-white"
        >
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
          <p>Library</p>
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
