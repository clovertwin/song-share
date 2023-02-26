import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentPlayingTypeState,
  currentTrackIdState,
} from "../atoms/songAtom";
import { Episode } from "../types/typings";
import useSpotify from "./useSpotify";

export default function useEpisodeInfo(session: Session | null) {
  const spotifyApi = useSpotify(session);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const currentPlayingType = useRecoilValue(currentPlayingTypeState);
  const [episodeInfo, setEpisodeInfo] = useState<Episode | null>(null);

  useEffect(() => {
    const fetchEpisodeInfo = async () => {
      if (currentTrackId && currentPlayingType === "episode") {
        const episodeInfo: Episode = await fetch(
          `https://api.spotify.com/v1/episodes/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setEpisodeInfo(episodeInfo);
      }
    };
    fetchEpisodeInfo();
  }, [currentTrackId, spotifyApi, currentPlayingType]);

  if (episodeInfo) return episodeInfo;
}
