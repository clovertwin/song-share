import { useEffect, useState } from "react";
import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import Image from "next/image";

interface Props {
  session: Session | null;
}

export default function Library({ session }: Props) {
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [spotifyApi, session]);

  return (
    <section className="bg-black h-screen w-full overflow-y-scroll scrollbar-hide text-white pb-36">
      <div className="flex items-center space-x-5 py-5 px-3">
        <Image
          alt="profile picture"
          src={session?.user.image as string}
          height={300}
          width={300}
          className="h-10 w-10 rounded-full"
        />
        <h1 className="text-2xl font-bold">Your Library</h1>
      </div>
      <div className="flex px-3 pb-5 space-x-5 text-sm">
        <button className="border-2 border-gray-800 text-gray-500 rounded-md py-1 px-3 text-xs sm:text-sm sm:px-5 xl:px-10 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white">
          Playlists
        </button>
        <button className="border-2 border-gray-800 text-gray-500 rounded-md py-1 px-3 text-xs sm:text-sm sm:px-5 xl:px-10 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white">
          Liked Songs
        </button>
      </div>
      {playlists &&
        playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="flex items-center py-3 rounded-lg space-x-5 px-3 hover:bg-gray-900"
          >
            {playlist.images.length > 0 ? (
              <Image
                alt={`${playlist.name} cover image`}
                src={playlist.images[0]?.url}
                height={640}
                width={640}
                className="h-12 w-12"
              />
            ) : (
              <div className="flex justify-center items-center h-12 w-12 text-xs text-center bg-gray-900">
                No Image
              </div>
            )}
            <h3 className="">{playlist.name}</h3>
          </div>
        ))}
    </section>
  );
}
