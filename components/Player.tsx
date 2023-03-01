import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth/core/types";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentPlayingTypeState,
  currentTrackIdState,
  isPlayingState,
} from "../atoms/songAtom";
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
import useEpisodeInfo from "../hooks/useEpisodeInfo";

interface Props {
  session: Session | null;
}

export default function Player({ session }: Props) {
  const spotifyApi = useSpotify(session);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentPlayingType, setCurrentPlayingType] = useRecoilState(
    currentPlayingTypeState
  );
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo(session);
  const episodeInfo = useEpisodeInfo(session);

  const debouncedAdjustVolume = useMemo(
    () =>
      debounce((volume: number) => {
        spotifyApi
          .setVolume(volume)
          .catch((error) =>
            console.log(
              "Sorry there was a problem connecting to device volume: ",
              error
            )
          );
      }, 300),
    [spotifyApi]
  );

  useEffect(() => {
    const fetchCurrentSong = () => {
      if (!songInfo && !episodeInfo) {
        spotifyApi
          .getMyCurrentPlayingTrack()
          .then((data) => {
            setCurrentTrackId(data.body?.item?.id as string);
          })
          .catch((error) =>
            console.log(
              "Sorry, there was an error fetching the currently playing track: ",
              error
            )
          );
        spotifyApi
          .getMyCurrentPlaybackState()
          .then((data) => {
            setIsPlaying(data?.body?.is_playing);
          })
          .catch((error) =>
            console.log(
              "Sorry, there was an error fetching current playback state: ",
              error
            )
          );
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
    episodeInfo,
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
    <div className="flex justify-between h-16 sm:h-24 px-2 text-xs text-white bg-gradient-to-b from-black to-gray-900 sm:grid sm:grid-cols-2 md:text-base md:px-8">
      {/** left */}
      <div className="flex items-center px-4 overflow-hidden space-x-4">
        {songInfo && currentPlayingType === "track" && (
          <Image
            src={songInfo?.album.images[0].url as string}
            alt="album artwork"
            height={640}
            width={640}
            className="h-10 w-10 md:inline"
          />
        )}
        {episodeInfo && currentPlayingType === "episode" && (
          <Image
            src={episodeInfo?.images[0].url as string}
            alt="album artwork"
            height={640}
            width={640}
            className="h-6 w-6 sm:h-10 sm:w-10 md:inline"
          />
        )}
        <div className="truncate">
          <h3>
            {currentPlayingType === "track"
              ? songInfo?.name
              : currentPlayingType === "episode"
              ? episodeInfo?.name
              : null}
          </h3>
          <p>
            {currentPlayingType === "track"
              ? songInfo?.artists[0].name
              : currentPlayingType === "episode"
              ? /* @ts-ignore */
                episodeInfo?.show.name
              : null}
          </p>
        </div>
      </div>
      {/** Center */}
      <div className="flex justify-between items-center">
        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayPause}
            className="h-8 w-8 pl-2 self-center cursor-pointer transition-transform ease-in-out duration-200 sm:h-10 sm:w-10 hover:scale-125"
          />
        ) : (
          <PlayIcon
            onClick={handlePlayPause}
            className="h-8 w-8 pl-2 cursor-pointer transition-transform ease-in-out duration-200 sm:h-10 sm:w-10 hover:scale-125"
          />
        )}
        {/** Right */}
        <div className="hidden sm:flex items-center justify-end sm:pr-5 space-x-3 md:space-x-4">
          <VolumeDown
            onClick={() => volume > 0 && setVolume(volume - 10)}
            className="hidden sm:block sm:h-5 sm:w-5 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125"
          />
          <input
            onChange={(e) => setVolume(+e.target.value)}
            className="w-20 h-1 range-sm md:w-28"
            type="range"
            value={volume}
            min={0}
            max={100}
          />
          <VolumeUp
            onClick={() => volume < 100 && setVolume(volume + 10)}
            className="hidden sm:block sm:h-5 sm:w-5 cursor-pointer transition-transform ease-in-out duration-200 hover:scale-125"
          />
        </div>
      </div>
    </div>
  );
}
