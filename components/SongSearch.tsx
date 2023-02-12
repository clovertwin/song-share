import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  songs: SpotifyApi.TrackObjectFull[];
}

/** Replace div surrounding Image with Link once song route is setup */

export default function SongSearch({ songs }: Props) {
  return (
    <div className="px-8">
      {songs.length > 0 &&
        songs.map((song) => (
          <div
            // href={`/album?id=${album.id}`}
            key={song.id}
            className="flex items-center space-x-3 p-5 rounded-md text-gray-500 hover:text-white hover:cursor-pointer hover:bg-gray-900"
          >
            {song.album.images.length > 0 ? (
              <Image
                alt={`${song.album.name} image`}
                src={song.album.images[0]?.url}
                height={640}
                width={640}
                className="h-14 w-14"
              />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center bg-gray-800">
                <PhotoIcon className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <h1 className="text-lg ml-5">{song.name}</h1>
          </div>
        ))}
    </div>
  );
}
