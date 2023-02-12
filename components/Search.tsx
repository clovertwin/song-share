import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchOpenState } from "../atoms/searchAtom";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth";
import ArtistSearch from "./AritistSearch";
import AlbumSearch from "./AlbumSearch";
import SongSearch from "./SongSearch";

interface Props {
  session: Session | null;
}

export default function Search({ session }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [artistSearchSelected, setArtistSearchSelected] = useState(true);
  const [albumSearchSelected, setAlbumSearchSelected] = useState(false);
  const [songSearchSelected, setSongSearchSelected] = useState(false);
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>([]);
  const [songs, setSongs] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const spotifyApi = useSpotify(session);

  const handleSearchTypeSelect = (type: "artist" | "album" | "song") => {
    switch (type) {
      case "artist":
        setArtistSearchSelected(true);
        setAlbumSearchSelected(false);
        setSongSearchSelected(false);
        break;
      case "album":
        setArtistSearchSelected(false);
        setAlbumSearchSelected(true);
        setSongSearchSelected(false);
        break;
      case "song":
        setArtistSearchSelected(false);
        setAlbumSearchSelected(false);
        setSongSearchSelected(true);
        break;
      default:
        setArtistSearchSelected(true);
        setAlbumSearchSelected(false);
        setSongSearchSelected(false);
    }
  };

  const handleSearch = () => {
    if (searchValue && artistSearchSelected) {
      spotifyApi.searchArtists(searchValue).then((data) => {
        if (data.body.artists) {
          setArtists(data.body.artists.items);
        }
      });
    } else if (searchValue && albumSearchSelected) {
      spotifyApi.searchAlbums(searchValue).then((data) => {
        if (data.body.albums) {
          setAlbums(data.body.albums.items);
        }
      });
    } else if (searchValue && songSearchSelected) {
      spotifyApi.searchTracks(searchValue).then((data) => {
        if (data.body.tracks) {
          setSongs(data.body.tracks?.items);
        }
      });
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setArtists([]);
    setAlbums([]);
    setSongs([]);
  };

  return (
    <div className="bg-black w-full h-screen overflow-y-scroll scrollbar-hide text-white pb-36">
      {/** Search Bar */}
      <div className="sticky top-0 flex flex-col p-10 bg-black">
        <div className="flex items-center justify-around pb-5 bg-black z-10">
          <div className="flex justify-center">
            <input
              className="ml-5 px-5 py-1 h-10 bg-black border-2 border-green-700 rounded-md focus:outline-none focus:border-green-400 focus:ring-green-500"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              type="text"
              name="search"
              id="search"
              placeholder="search for artists.."
              autoComplete="off"
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="ml-5 rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
            >
              search
            </button>
            <button
              onClick={handleClear}
              className="ml-5 rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
            >
              clear
            </button>
          </div>
          <div
            onClick={() => setSearchOpen(!searchOpen)}
            className="mr-10 w-9 rounded-md border-2 border-gray-800 active:bg-gray-900 hover:border-gray-700 focus:border-gray-700 hover:cursor-pointer"
          >
            <XMarkIcon className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center justify-center space-x-10 bg-black">
          <button
            onClick={() => handleSearchTypeSelect("artist")}
            className={`border-2 ${
              artistSearchSelected
                ? `border-gray-700 text-white`
                : `border-gray-800 text-gray-500`
            } rounded-md py-1 px-5 text-md 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
          >
            Artists
          </button>
          <button
            onClick={() => handleSearchTypeSelect("album")}
            className={`border-2 ${
              albumSearchSelected
                ? `border-gray-700 text-white`
                : `border-gray-800 text-gray-500`
            } rounded-md py-1 px-5 text-md 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
          >
            Albums
          </button>
          <button
            onClick={() => handleSearchTypeSelect("song")}
            className={`border-2 ${
              songSearchSelected
                ? `border-gray-700 text-white`
                : `border-gray-800 text-gray-500`
            } rounded-md py-1 px-5 text-md 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
          >
            Songs
          </button>
        </div>
      </div>
      {/** Search Results */}
      {artistSearchSelected && <ArtistSearch artists={artists} />}
      {albumSearchSelected && <AlbumSearch albums={albums} />}
      {songSearchSelected && <SongSearch songs={songs} />}
    </div>
  );
}
