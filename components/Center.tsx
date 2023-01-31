import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
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

function randomColor(arr: string[]) {
  const arrCopy = [...arr];
  for (let i = arrCopy.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i + 1);
    let temp = arrCopy[i];
    arrCopy[i] = arrCopy[j];
    arrCopy[j] = temp;
  }
  return arrCopy.pop();
}

export default function Center({ session }: Props) {
  const spotifyApi = useSpotify(session);
  const [color, setColor] = useState<string | null | undefined>(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  // Setting the background to a random color when the component mounts or when the playlistId state changes.
  useEffect(() => {
    setColor(randomColor(colors));
  }, [playlistId]);

  // When playlistId changes or when the component mounts, and if the user has an accessToken,
  // request the playlist data using the playlistId state. Then set playlist state to that data.
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => setPlaylist(data.body))
        .catch((error) => console.log("Something went wrong", error));
    }
  }, [spotifyApi, playlistId, setPlaylist]);

  console.log(playlist);

  return (
    <div className="flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black bg-opacity-20 p-1 pr-2 space-x-3 opacity-90 hover:opacity-70 cursor-pointer rounded-full">
          <img
            className="rounded-full w-10 h-10"
            alt="photo of user"
            src={session?.user.image}
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5, w-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 text-white p-8`}
      >
        {playlist?.images.length > 0 ? (
          <img
            src={playlist?.images[0]?.url}
            alt="playlist image"
            className="h-44 w-44"
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
      <div className="p-8">
        <Songs />
      </div>
    </div>
  );
}
