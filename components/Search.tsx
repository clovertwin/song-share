import { useMemo, useState, ChangeEvent, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchSelectedState } from "../atoms/searchAtom";
import { useRecoilState } from "recoil";
import { debounce } from "lodash";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function Search({ session }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [topArtist, setTopArtist] = useState<string | undefined>("");
  const [searchSelected, setSearchSelected] =
    useRecoilState(searchSelectedState);
  const spotifyApi = useSpotify(session);

  const handleSubmit = () => {
    if (searchValue) {
      spotifyApi
        .searchArtists(searchValue)
        .then((data) => setTopArtist(data.body.artists?.items[0].name));
    }
  };

  console.log(topArtist);

  return (
    <div className="h-screen mx-auto flex justify-center items-center text-white">
      <div
        onClick={() => setSearchSelected(!searchSelected)}
        className="absolute top-10 right-10 rounded-md border-2 border-gray-800 active:bg-gray-900 hover:border-gray-700"
      >
        <XMarkIcon className="h-8 w-8 text-gray-500" />
      </div>
      <form>
        <input
          className="ml-5 px-5 py-1 bg-black border-2 border-green-700 rounded-md focus:outline-none focus:border-green-400 focus:ring-green-500"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          type="text"
          name="search"
          id="search"
          placeholder="search for songs.."
        />
      </form>
      <button
        onClick={handleSubmit}
        className="ml-5 rounded-md px-5 py-1 border-2 border-gray-800 active:bg-gray-900 hover:border-gray-700"
      >
        search
      </button>
      <button
        onClick={() => setSearchValue("")}
        className="ml-5 rounded-md px-5 py-1 border-2 border-gray-800 active:bg-gray-900 hover:border-gray-700"
      >
        clear
      </button>
      <p className="text-white">{topArtist}</p>
    </div>
  );
}
