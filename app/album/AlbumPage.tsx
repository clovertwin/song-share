"use client";
import { useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import useSpotify from "../../hooks/useSpotify";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { searchSelectedAlbumState } from "../../atoms/searchSelectedAlbum";

interface Props {
  session: Session | null;
}

export default function Album({ session }: Props) {
  const [album, setAlbum] = useRecoilState(searchSelectedAlbumState);
  const searchParams = useSearchParams();
  const albumId = searchParams.get("id");
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && albumId) {
      spotifyApi.getAlbum(albumId).then((data) => {
        setAlbum(data.body);
      });
    }
  }, [albumId, spotifyApi, setAlbum]);

  return (
    <div className="flex justify-center items-center h-screen">
      {album.name}
    </div>
  );
}
