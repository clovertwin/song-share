import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchSelectedState } from "../atoms/searchAtom";
import { useRecoilState } from "recoil";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [searchSelected, setSearchSelected] =
    useRecoilState(searchSelectedState);

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
        onClick={() => setSearchValue("")}
        className="ml-5 rounded-md px-5 py-1 border-2 border-gray-800 active:bg-gray-900 hover:border-gray-700"
      >
        clear
      </button>
    </div>
  );
}
