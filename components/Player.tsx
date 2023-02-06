import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth/core/types";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import {
  ArrowsRightLeftIcon,
  SpeakerWaveIcon as VolumeDown,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon as VolumeUp,
} from "@heroicons/react/24/solid";
import { debounce } from "lodash";

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

  const debouncedAdjustVolume = useMemo(
    () =>
      debounce((volume: number) => {
        spotifyApi.setVolume(volume).catch((error) => {});
      }, 300),
    [spotifyApi]
  );

  useEffect(() => {
    const fetchCurrentSong = () => {
      if (!songInfo) {
        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
          setCurrentTrackId(data.body?.item?.id as string);
        });
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data?.body?.is_playing);
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

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume, debouncedAdjustVolume]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else if (!data.body.is_playing) {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  return (
    <div className="grid grid-cols-3 h-24 px-2 text-xs text-white bg-gradient-to-b from-black to-gray-900 md:text-base md:px-8">
      {/** left */}
      <div className="flex items-center space-x-4">
        {songInfo && (
          <Image
            src={songInfo?.album.images[0].url as string}
            alt="album artwork"
            height={640}
            width={640}
            className="hidden h-10 w-10 md:inline"
          />
        )}
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="h-5 w-5 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125" />
        <BackwardIcon className="h-5 w-5 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125" />
        {isPlaying ? (
          <PlayIcon
            onClick={handlePlayPause}
            className="h-10 w-10 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125"
          />
        ) : (
          <PauseIcon
            onClick={handlePlayPause}
            className="h-10 w-10 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125"
          />
        )}
        <ForwardIcon className="h-5 w-5 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125" />
        <ArrowUturnLeftIcon className="h-5 w-5 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125" />
      </div>
      <div className="flex items-center justify-end pr-5 space-x-3 md:space-x-4">
        <VolumeDown
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="h-5 w-5 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125"
        />
        <input
          onChange={(e) => setVolume(+e.target.value)}
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
        />
        <VolumeUp
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="h-5 w-5 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125"
        />
      </div>
    </div>
  );
}
