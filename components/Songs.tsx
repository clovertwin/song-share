import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import { Session } from "next-auth/core/types";
import Song from "./Song";

interface Props {
  session: Session | null;
}

export default function Songs({ session }: Props) {
  const playlist = useRecoilValue(playlistState);

  return (
    <div>
      {playlist?.tracks.items.map((item, index) => (
        <Song
          key={item.track?.id}
          track={item}
          order={index}
          session={session}
        />
      ))}
    </div>
  );
}
