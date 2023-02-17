import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useSetRecoilState } from "recoil";
import {
  artistComponentOpenState,
  selectedArtistId,
} from "../atoms/artistAtom";
import { artistSearchOpenState } from "../atoms/searchSelectedArtist";
import { nanoid } from "nanoid";

interface Props {
  artists: SpotifyApi.ArtistObjectFull[];
  fetchMore: (next: string) => void;
  next: string;
}

export default function ArtistSearch({ artists, fetchMore, next }: Props) {
  const setArtistComponentOpen = useSetRecoilState(artistComponentOpenState);
  const setArtistId = useSetRecoilState(selectedArtistId);
  const setArtistSearchOpen = useSetRecoilState(artistSearchOpenState);

  const handleSelect = (id: string) => {
    setArtistId(id);
    setArtistComponentOpen(true);
    setArtistSearchOpen(false);
  };

  return (
    <div className="px-8">
      {artists.length > 0 &&
        artists.map((artist, i) => (
          <div
            onClick={() => handleSelect(artist.id)}
            key={nanoid()}
            className="flex items-center space-x-3 p-5 rounded-md text-gray-500 hover:text-white hover:cursor-pointer hover:bg-gray-900"
          >
            <p className="mr-4">{i + 1}</p>
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
      {artists.length > 0 && (
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
