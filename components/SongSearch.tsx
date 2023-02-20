import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useSetRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { currentTrackIdState } from "../atoms/songAtom";
import { isPlayingState } from "../atoms/songAtom";
import { Session } from "next-auth";
import { nanoid } from "nanoid";

interface Props {
  session: Session | null;
  songs: SpotifyApi.TrackObjectFull[];
  fetchMore: (next: string) => void;
  next: string;
}

export default function SongSearch({ session, songs, fetchMore, next }: Props) {
  const spotifyApi = useSpotify(session);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setIsPlaying = useSetRecoilState(isPlayingState);

  const handlePlaySong = (uri: string, id: string) => {
    setCurrentTrackId(id);
    setIsPlaying(true);
    spotifyApi.play({ uris: [uri] });
  };

  return (
    <div className="px-8">
      {songs.length > 0 &&
        songs.map((song, i) => (
          <div
            onClick={() => handlePlaySong(song.uri, song.id)}
            key={nanoid()}
            className="flex items-center space-x-3 p-5 rounded-md text-gray-500 hover:text-white hover:cursor-pointer hover:bg-gray-900"
          >
            <p className="mr-4">{i + 1}</p>
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
      {songs.length > 0 && (
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
