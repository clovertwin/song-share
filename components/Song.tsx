import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth/core/types";
import Image from "next/image";
import millisToMinutesAndSeconds from "../lib/millisToMinutesAndSeconds";
import { useSetRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";

interface Props {
  track: SpotifyApi.PlaylistTrackObject;
  order: number;
  session: Session | null;
}

export default function Song({ track, order, session }: Props) {
  const spotifyApi = useSpotify(session);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setIsPlaying = useSetRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track?.id as string);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track?.uri as string],
    });
  };

  return (
    <div
      className="grid grid-cols-2 py-4 px-5 text-gray-500 rounded-lg hover:cursor-pointer hover:bg-gray-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <Image
          src={track.track?.album.images[0].url as string}
          alt="album artwork"
          className="h-10 w-10"
          height={640}
          width={640}
        />
        <div>
          <p className="w-36 lg:w-64 truncate text-white">
            {track.track?.name}
          </p>
          <p className="w-40">{track.track?.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden w-40 md:inline lg:w-72">
          {track.track?.album.name}
        </p>
        <p>{millisToMinutesAndSeconds(track.track?.duration_ms as number)}</p>
      </div>
    </div>
  );
}
