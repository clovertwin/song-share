import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useSetRecoilState } from "recoil";
import { selectedShowId, showComponentOpenState } from "../atoms/showAtom";
import { showSearchOpenState } from "../atoms/searchSelectedShow";

interface Props {
  shows: SpotifyApi.ShowObjectSimplified[];
}

export default function ShowSearch({ shows }: Props) {
  const setShowId = useSetRecoilState(selectedShowId);
  const setShowComponentOpen = useSetRecoilState(showComponentOpenState);
  const setShowSearchOpen = useSetRecoilState(showSearchOpenState);

  const handleSelect = (id: string) => {
    setShowId(id);
    setShowComponentOpen(true);
    setShowSearchOpen(false);
  };

  return (
    <div className="px-8">
      {shows.length > 0 &&
        shows.map((show) => (
          <div
            onClick={() => handleSelect(show.id)}
            key={show.id}
            className="flex items-center space-x-3 p-5 rounded-md text-gray-500 hover:text-white hover:cursor-pointer hover:bg-gray-900"
          >
            {show.images.length > 0 ? (
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
            <h1 className="text-lg ml-5">{show.name}</h1>
          </div>
        ))}
    </div>
  );
}
