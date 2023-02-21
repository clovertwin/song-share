import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchSelectedArtistState } from "../atoms/searchSelectedArtist";
import { selectedArtistId } from "../atoms/artistAtom";
import Image from "next/image";

interface Props {
  session: Session | null;
}

export default function ArtistLayout({ session }: Props) {
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>([]);
  const artistId = useRecoilValue(selectedArtistId);
  // const [artist, setArtist] = useRecoilState(searchSelectedArtistState);
  const [artist, setArtist] = useState<SpotifyApi.SingleArtistResponse | null>(
    null
  );
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && artistId) {
      spotifyApi.getArtist(artistId).then((data) => {
        setArtist(data.body);
        console.log(data.body);
      });
    }
  }, [spotifyApi, setArtist, artistId]);

  useEffect(() => {
    spotifyApi.getArtistAlbums(artistId).then((data) => {
      setAlbums(data.body.items);
      console.log(data.body);
    });
  }, [spotifyApi, artistId]);

  return (
    <div className="px-8">
      <>
        <div className="flex justify-start items-end space-x-5">
          {artist && (
            <Image
              alt={`${artist?.name} image`}
              src={artist?.images[2].url as string}
              height={artist?.images[2].height}
              width={artist?.images[2].width}
            />
          )}
          <h1 className="pr-10 font-bold text-5xl">{artist?.name}</h1>
        </div>
        {albums &&
          albums.map((album) => <div key={album.id}>{album.name}</div>)}
      </>
    </div>
  );
}
