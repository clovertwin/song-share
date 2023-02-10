import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchOpenState } from "../atoms/searchAtom";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth";
import Image from "next/image";
import { searchSelectedArtistState } from "../atoms/searchSelectedArtist";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface Props {
  session: Session | null;
}

export default function Search({ session }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [artistSearchSelected, setArtistSearchSelected] = useState(true);
  const [albumSearchSelected, setAlbumSearchSelected] = useState(false);
  const [songSearchSelected, setSongSearchSelected] = useState(false);
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[] | []>(
    []
  );
  const [selectedArtist, setSelectedArtist] = useRecoilState(
    searchSelectedArtistState
  );
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && selectedArtist.name) {
      spotifyApi.getArtistAlbums(selectedArtist.id).then((data) => {
        console.log(data.body.items);
      });
    }
  }, [selectedArtist, spotifyApi]);

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
    if (searchValue) {
      spotifyApi.searchArtists(searchValue).then((data) => {
        if (data.body.artists) {
          setArtists(data.body.artists.items);
        }
      });
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setArtists([]);
  };

  const handleSelectArtist = (artist: SpotifyApi.ArtistObjectFull) => {
    setSelectedArtist(artist);
  };

  if (artistSearchSelected) console.log("artist page selected");
  else if (albumSearchSelected) console.log("album page selected");
  else if (songSearchSelected) console.log("song page selected");

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
            className="border-2 border-gray-800 text-gray-500 rounded-md py-1 px-10 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white"
          >
            Artists
          </button>
          <button
            onClick={() => handleSearchTypeSelect("album")}
            className="border-2 border-gray-800 text-gray-500 rounded-md py-1 px-10 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white"
          >
            Albums
          </button>
          <button
            onClick={() => handleSearchTypeSelect("song")}
            className="border-2 border-gray-800 text-gray-500 rounded-md py-1 px-10 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white"
          >
            Songs
          </button>
        </div>
      </div>
      {/** Search Results */}
      <div className="px-8">
        {artists.length > 0 &&
          artists.map((artist: SpotifyApi.ArtistObjectFull) => (
            <div
              onClick={() => handleSelectArtist(artist)}
              key={artist.id}
              className="flex items-center space-x-3 p-5 rounded-md text-gray-500 hover:text-white hover:cursor-pointer hover:bg-gray-900"
            >
              {artist.images.length > 0 ? (
                <Image
                  alt={`${artist.name} image`}
                  src={artist.images[0]?.url}
                  height={640}
                  width={640}
                  className="h-14 w-14"
                />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800">
                  <PhotoIcon className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <h1 className="text-lg ml-5">{artist.name}</h1>
            </div>
          ))}
      </div>
    </div>
  );
}
