import Image from "next/image";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth/core/types";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";

interface Props {
  session: Session | null;
}

export default function Player({ session }: Props) {
  const spotifyApi = useSpotify(session);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo(session);

  useEffect(() => {
    const fetchCurrentSong = () => {
      if (!songInfo) {
        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
          setCurrentTrackId(data.body.item?.id as string);
          spotifyApi.getMyCurrentPlaybackState().then((data) => {
            setIsPlaying(data.body.is_playing);
          });
        });
      }
    };
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [
    spotifyApi,
    session,
    currentTrackId,
    setCurrentTrackId,
    setIsPlaying,
    songInfo,
  ]);

  return (
    <div className="text-white">
      {/** left */}
      <div>
        {songInfo && (
          <Image
            src={songInfo?.album.images[0].url as string}
            alt="album artwork"
            height={640}
            width={640}
            className="hidden h-10 w-10 md:inline"
          />
        )}
      </div>
    </div>
  );
}
