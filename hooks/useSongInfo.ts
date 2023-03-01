import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  currentPlayingTypeState,
  currentTrackIdState,
} from "../atoms/songAtom";
import { Track } from "../types/typings";
import useSpotify from "./useSpotify";

export default function useSongInfo(session: Session | null) {
  const spotifyApi = useSpotify(session);
  const currentTrackId = useRecoilValue(currentTrackIdState);
  const currentPlayingType = useRecoilValue(currentPlayingTypeState);
  const [songInfo, setSongInfo] = useState<Track | null>(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId && currentPlayingType === "track") {
        const trackInfo: Track = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotifyApi, currentPlayingType]);

  if (songInfo) return songInfo;
}
