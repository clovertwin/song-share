"use client";
import { useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import useSpotify from "../../hooks/useSpotify";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { searchSelectedSongState } from "../../atoms/searchSelectedSong";

interface Props {
  session: Session | null;
}

export default function Song({ session }: Props) {
  const [song, setSong] = useRecoilState(searchSelectedSongState);
  const searchParams = useSearchParams();
  const songId = searchParams.get("id");
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && songId) {
      spotifyApi.getTrack(songId).then((data) => {
        setSong(data.body);
      });
    }
  }, [songId, spotifyApi, setSong]);

  return (
    <>
      {song ? (
        <div className="flex justify-center items-center h-screen">
          {song.name}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
