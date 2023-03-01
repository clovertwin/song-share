import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import {
  artistComponentOpenState,
  selectedArtistId,
} from "../atoms/artistAtom";
import Image from "next/image";
import { nanoid } from "nanoid";
import AlbumLayout from "./AlbumLayout";
import {
  albumComponentOpenState,
  selectedAlbumIdState,
} from "../atoms/albumAtom";
import addCommas from "../lib/addCommas";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { artistSearchOpenState } from "../atoms/searchSelectedArtist";

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
  const [albumComponentOpen, setAlbumComponentOpen] = useRecoilState(
    albumComponentOpenState
  );
  const setArtistComponentOpen = useSetRecoilState(artistComponentOpenState);
  const setArtistSearchOpen = useSetRecoilState(artistSearchOpenState);
  const setAlbumId = useSetRecoilState(selectedAlbumIdState);
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

  useEffect(() => {
    return () => setAlbumComponentOpen(false);
  }, [setAlbumComponentOpen]);

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
    <>
      {!albumComponentOpen ? (
        <div className="sm:px-8">
          <ArrowLeftCircleIcon
            onClick={() => {
              setArtistComponentOpen(false);
              setArtistSearchOpen(true);
            }}
            className="text-gray-500 block ml-4 mb-5 h-10 w-10 hover:text-white hover:cursor-pointer"
          >
            Back
          </ArrowLeftCircleIcon>
          <>
            <div className="flex space-x-4 items-center px-5 xs:justify-start sm:space-x-8">
              {artist && (
                <div className="rounded-full h-20 w-20 overflow-hidden">
                  <Image
                    alt={`${artist?.name} image`}
                    src={artist?.images[2].url as string}
                    height={artist?.images[2].height}
                    width={artist?.images[2].width}
                  />
                </div>
              )}
              <div>
                <h1 className="pb-2 font-bold text-lg sm:text-3xl sm:pr-10 lg:text-5xl">
                  {artist?.name}
                </h1>
                <p className="text-gray-500 text-xs sm:text-lg">
                  Followers:{" "}
                  {artist?.followers.total
                    ? addCommas(artist?.followers.total)
                    : 0}
                </p>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg pt-5">Albums</h3>
              {albums &&
                albums.map((album) => (
                  <div
                    key={nanoid()}
                    className="flex items-center space-x-4 py-4 rounded-lg sm:px-5 hover:cursor-pointer hover:bg-gray-900"
                    onClick={() => {
                      setAlbumId(album.id);
                      setAlbumComponentOpen(true);
                    }}
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
      ) : (
        <AlbumLayout session={session} />
      )}
    </>
  );
}
