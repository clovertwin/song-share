import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  artists: SpotifyApi.ArtistObjectFull[];
}

export default function ArtistSearch({ artists }: Props) {
  return (
    <div className="px-8">
      {artists.length > 0 &&
        artists.map((artist: SpotifyApi.ArtistObjectFull) => (
          <Link
            href={`/artist?id=${artist.id}`}
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
          </Link>
        ))}
    </div>
  );
}