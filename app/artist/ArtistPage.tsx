"use client";
import { useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import useSpotify from "../../hooks/useSpotify";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { searchSelectedArtistState } from "../../atoms/searchSelectedArtist";

interface Props {
  session: Session | null;
}

export default function Artist({ session }: Props) {
  const [artist, setArtist] = useRecoilState(searchSelectedArtistState);
  const searchParams = useSearchParams();
  const artistId = searchParams.get("id");
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && artistId) {
      spotifyApi.getArtist(artistId).then((data) => {
        setArtist(data.body);
      });
    }
  }, [artistId, spotifyApi, setArtist]);

  return (
    <div className="flex justify-center items-center h-screen">
      {artist.name}
    </div>
  );
}
