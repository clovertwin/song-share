import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchOpenState } from "../atoms/searchAtom";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth";
import { searchArtistsState } from "../atoms/artistAtom";

interface Props {
  session: Session | null;
}

export default function Search({ session }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const [artists, setArtists] = useRecoilState(searchArtistsState);
  const spotifyApi = useSpotify(session);

  const handleSubmit = () => {
    if (searchValue) {
      spotifyApi.searchArtists(searchValue).then((data) => {
        if (data.body.artists) {
          setArtists(data.body.artists.items);
          console.log(data.body.artists.items);
        }
      });
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setArtists([]);
  };

  return (
    <div className="bg-black w-full h-screen overflow-y-scroll text-white pb-36">
      <div className="sticky top-0 flex items-center justify-around py-10 bg-black z-10">
        <div className="flex justify-center">
          <input
            className="ml-5 px-5 py-1 h-10 bg-black border-2 border-green-700 rounded-md focus:outline-none focus:border-green-400 focus:ring-green-500"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            type="text"
            name="search"
            id="search"
            placeholder="search for artists.."
          />
          <button
            onClick={handleSubmit}
            className="ml-5 rounded-md px-5 py-1 h-10 border-2 border-gray-800 active:bg-gray-900 hover:border-gray-700"
          >
            search
          </button>
          <button
            onClick={handleClear}
            className="ml-5 rounded-md px-5 py-1 h-10 border-2 border-gray-800 active:bg-gray-900 hover:border-gray-700"
          >
            clear
          </button>
        </div>
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="mr-10 w-9 rounded-md border-2 border-gray-800 active:bg-gray-900 hover:border-gray-700 hover:cursor-pointer"
        >
          <XMarkIcon className="h-8 w-8 text-gray-500" />
        </div>
      </div>
      {artists.length > 0 &&
        artists.map((artist: SpotifyApi.ArtistObjectFull, i) => (
          <div className="flex" key={artist.id}>
            <p className="text-2xl ml-5">{i + 1}</p>
            <h1 className="text-2xl ml-5">{artist.name}</h1>
          </div>
        ))}
    </div>
  );
}
