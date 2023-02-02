import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth/core/types";
import Image from "next/image";

interface Props {
  track: SpotifyApi.PlaylistTrackObject;
  order: number;
  session: Session | null;
}

export default function Song({ track, order, session }: Props) {
  const spotifyApi = useSpotify(session);
  return (
    <div className="grid grid-cols-2 pb-5">
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
          <p>{track.track?.name}</p>
          <p>{track.track?.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden md:inline">{track.track?.album.name}</p>
        <p>duration</p>
      </div>
    </div>
  );
}
