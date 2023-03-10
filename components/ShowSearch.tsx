import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useSetRecoilState } from "recoil";
import { selectedShowIdState, showComponentOpenState } from "../atoms/showAtom";
import { showSearchOpenState } from "../atoms/searchSelectedShow";
import { nanoid } from "nanoid";

interface Props {
  shows: SpotifyApi.ShowObjectSimplified[];
  fetchMore: (next: string) => void;
  next: string;
}

export default function ShowSearch({ shows, fetchMore, next }: Props) {
  const setShowId = useSetRecoilState(selectedShowIdState);
  const setShowComponentOpen = useSetRecoilState(showComponentOpenState);
  const setShowSearchOpen = useSetRecoilState(showSearchOpenState);

  const handleSelect = (id: string) => {
    setShowId(id);
    setShowComponentOpen(true);
    setShowSearchOpen(false);
  };

  return (
    <div className="sm:px-8">
      <div>
        {shows.length > 0 &&
          shows.map((show, i) => (
            <div
              onClick={() => handleSelect(show.id)}
              key={nanoid()}
              className="flex items-center space-x-3 p-5 rounded-md text-gray-500 hover:text-white hover:cursor-pointer hover:bg-gray-900"
            >
              <p className="sm:mr-4">{i + 1 < 10 ? "0" + (i + 1) : i + 1}</p>
              {show.images?.length > 0 ? (
                <Image
                  alt={`${show.name} image`}
                  src={show.images[0]?.url}
                  height={640}
                  width={640}
                  className="h-14 w-14"
                />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800">
                  <PhotoIcon className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <h1 className="ml-5 truncate sm:text-lg">{show.name}</h1>
            </div>
          ))}
      </div>
      {shows.length > 0 && (
        <div className="flex justify-center pt-5">
          <button
            className="rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
            onClick={() => fetchMore(next)}
          >
            Load More...
          </button>
        </div>
      )}
    </div>
  );
}
