import { useEffect, useState } from "react";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function randomColor(arr: string[], color: string) {
  const getColor = () => arr[Math.floor(Math.random() * arr.length)];
  let newColor = getColor();
  while (newColor === color) {
    newColor = getColor();
  }
  return newColor;
}

export default function PlaylistLayout({ session }: Props) {
  const spotifyApi = useSpotify(session);
  const [color, setColor] = useState("");
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  // Setting the background to a random color when the component mounts or when the playlistId state changes.
  useEffect(() => {
    setColor((c) => randomColor(colors, c));
  }, [playlistId]);

  // When playlistId changes or when the component mounts, and if the user has an accessToken,
  // request the playlist data using the playlistId state. Then set playlist state to that data.
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => setPlaylist(data.body))
        .catch((error) =>
          console.log("Something went wrong fetching playlist: ", error)
        );
    }
  }, [spotifyApi, playlistId, setPlaylist]);

  return (
    <div className="flex-grow text-white h-screen pb-36 overflow-y-scroll scrollbar-hide">
      <section
        className={`flex items-end space-x-7 p-8 h-60 bg-gradient-to-b ${color} to-black text-white sm:h-80`}
      >
        {playlist?.images.length > 0 ? (
          <Image
            src={playlist?.images[0]?.url}
            alt="playlist image"
            className="h-28 w-28 sm:h-44 sm:w-44"
            width={640}
            height={640}
            priority={true}
          />
        ) : (
          <div className="flex items-center justify-center text-xs h-44 w-44 bg-black opacity-60">
            {playlist?.name}
          </div>
        )}
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div className="sm:p-8">
        <Songs session={session} />
      </div>
    </div>
  );
}
