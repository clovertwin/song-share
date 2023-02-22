import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedArtistId } from "../atoms/artistAtom";
import Image from "next/image";
import { nanoid } from "nanoid";

interface Props {
  session: Session | null;
}

export default function ArtistLayout({ session }: Props) {
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>([]);
  const [artist, setArtist] = useState<SpotifyApi.SingleArtistResponse | null>(
    null
  );
  const [next, setNext] = useState("");
  const [showLoadMore, setShowLoadMore] = useState(false);
  const artistId = useRecoilValue(selectedArtistId);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && artistId) {
      spotifyApi.getArtist(artistId).then((data) => {
        setArtist(data.body);
      });
      spotifyApi.getArtistAlbums(artistId).then((data) => {
        setAlbums(data.body.items);
        if (data.body.next) {
          setNext(data.body.next);
          setShowLoadMore(true);
        }
      });
    }
  }, [spotifyApi, setArtist, artistId]);

  const fetchMore = (next: string) => {
    fetch(next, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        Host: "api.spotify.com",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAlbums((prev) => [...prev, ...data.items]);
        if (data.next) {
          setNext(data.next);
          setShowLoadMore(true);
        } else {
          setShowLoadMore(false);
        }
      });
  };

  return (
    <div className="px-8">
      <>
        <div className="flex justify-start items-center space-x-8">
          {artist && (
            <div className="rounded-full h-40 w-40 overflow-hidden">
              <Image
                alt={`${artist?.name} image`}
                src={artist?.images[2].url as string}
                height={artist?.images[2].height}
                width={artist?.images[2].width}
              />
            </div>
          )}
          <div>
            <h1 className="pr-10 font-bold text-5xl">{artist?.name}</h1>
            <p className="text-lg text-gray-500">
              Followers: {artist?.followers.total}
            </p>
          </div>
        </div>
        <div className="p-2">
          <h3 className="font-bold text-lg pt-5">Albums</h3>
          {albums &&
            albums.map((album) => (
              <div
                key={nanoid()}
                className="flex items-center space-x-4 py-4 px-5"
              >
                <Image
                  alt={`${album.name} cover art`}
                  src={album.images[0].url}
                  height={album.images[0].height}
                  width={album.images[0].width}
                  className="h-16 w-16"
                />
                <div>
                  <h4>{album.name}</h4>
                  <p className="text-gray-500">
                    {album.release_date.split("-")[0]}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {showLoadMore ? (
          <div className="flex justify-center">
            <button
              onClick={() => fetchMore(next)}
              className="rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
            >
              Load more...
            </button>
          </div>
        ) : null}
      </>
    </div>
  );
}
