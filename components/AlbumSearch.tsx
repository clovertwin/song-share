import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useSetRecoilState, useRecoilState } from "recoil";
import {
  albumComponentOpenState,
  selectedAlbumIdState,
} from "../atoms/albumAtom";
import { albumSearchOpenState } from "../atoms/searchSelectedAlbum";
import { nanoid } from "nanoid";
import { Session } from "next-auth";

interface Props {
  albums: SpotifyApi.AlbumObjectSimplified[];
  fetchMore: (next: string) => void;
  next: string;
}

export default function AlbumSearch({ albums, fetchMore, next }: Props) {
  const setAlbumId = useSetRecoilState(selectedAlbumIdState);
  const setAlbumComponentOpen = useSetRecoilState(albumComponentOpenState);
  const setAlbumSearchOpen = useSetRecoilState(albumSearchOpenState);

  const handleSelect = (id: string) => {
    setAlbumId(id);
    setAlbumComponentOpen(true);
    setAlbumSearchOpen(false);
  };

  return (
    <div className="sm:px-8">
      <div>
        {albums.length > 0 &&
          albums.map((album, i) => (
            <div
              onClick={() => handleSelect(album.id)}
              key={nanoid()}
              className="flex items-center space-x-3 p-5 rounded-md text-gray-500 hover:text-white hover:cursor-pointer hover:bg-gray-900"
            >
              <p className="sm:mr-4">{i + 1}</p>
              {album.images.length > 0 ? (
                <Image
                  alt={`${album.name} image`}
                  src={album.images[0]?.url}
                  height={640}
                  width={640}
                  className="h-14 w-14"
                />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800">
                  <PhotoIcon className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <h1 className="sm:text-lg ml-5">{album.name}</h1>
            </div>
          ))}
      </div>
      {albums.length > 0 && (
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
