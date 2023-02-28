import { useEffect, useState } from "react";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

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
  let newColor = arr[Math.floor(Math.random() * arr.length)];
  while (newColor === color) {
    newColor = arr[Math.floor(Math.random() * arr.length)];
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
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-white bg-opacity-20 p-1 pr-2 space-x-3 opacity-90 hover:bg-opacity-50 cursor-pointer rounded-full"
          onClick={() => signOut()}
        >
          <Image
            className="rounded-full w-10 h-10"
            alt="photo of user"
            src={session?.user.image as string}
            height={300}
            width={300}
            priority={true}
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5, w-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 text-white p-8`}
      >
        {playlist?.images.length > 0 ? (
          <Image
            src={playlist?.images[0]?.url}
            alt="playlist image"
            className="h-44 w-44"
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
      <div className="p-8">
        <Songs session={session} />
      </div>
    </div>
  );
}
