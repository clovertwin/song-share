import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  albumSearchOpenState,
  searchSelectedAlbumState,
} from "../atoms/searchSelectedAlbum";
import {
  albumComponentOpenState,
  selectedAlbumIdState,
} from "../atoms/albumAtom";
import {
  currentPlayingTypeState,
  currentTrackIdState,
  isPlayingState,
} from "../atoms/songAtom";
import Image from "next/image";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import millisToMinutesAndSeconds from "../lib/millisToMinutesAndSeconds";

interface Props {
  session: Session | null;
}

export default function AlbumLayout({ session }: Props) {
  const albumId = useRecoilValue(selectedAlbumIdState);
  const [album, setAlbum] = useRecoilState(searchSelectedAlbumState);
  const setAlbumComponentOpen = useSetRecoilState(albumComponentOpenState);
  const setAlbumSearchOpen = useSetRecoilState(albumSearchOpenState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setCurrentPlayingType = useSetRecoilState(currentPlayingTypeState);
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectSimplified[]>([]);
  const [next, setNext] = useState("");
  const [loadMore, setLoadMore] = useState(false);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && albumId) {
      spotifyApi.getAlbum(albumId).then((data) => {
        setAlbum(data.body);
      });
      spotifyApi.getAlbumTracks(albumId).then((data) => {
        setTracks(data.body.items);
        if (data.body.next) {
          setNext(data.body.next);
          setLoadMore(true);
        }
      });
    }
  }, [spotifyApi, setAlbum, albumId]);

  const handlePlaySong = (uri: string, id: string) => {
    setCurrentTrackId(id);
    setCurrentPlayingType("track");
    setIsPlaying(true);
    spotifyApi.play({ uris: [uri] });
  };

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
        setTracks((prev) => [...prev, ...data.items]);
        if (data.next) {
          setNext(data.next);
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
      });
  };

  return (
    <div className="sm:px-8">
      <ArrowLeftCircleIcon
        onClick={() => {
          setAlbumComponentOpen(false);
          setAlbumSearchOpen(true);
        }}
        className="text-gray-500 mb-5 ml-4 h-10 w-10 hover:text-white hover:cursor-pointer"
      >
        Back
      </ArrowLeftCircleIcon>
      {album.images && (
        <div className="flex items-center px-5 space-x-4 sm:space-x-10 pb-5">
          <Image
            alt={`${album.name} cover art`}
            src={album.images[0].url}
            height={album.images[0].height}
            width={album.images[0].width}
            className="h-16 w-16 sm:w-40 sm:h-40"
          />
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-2xl font-bold truncate sm:pr-10">
              {album.name}
            </h1>
            <p className="text-gray-500 text-lg">
              {album.release_date.split("-")[0]}
            </p>
          </div>
        </div>
      )}
      {tracks.map((track, i) => (
        <div
          key={i}
          className="flex justify-between items-center px-5 py-4 rounded-lg hover:cursor-pointer hover:bg-gray-900 sm:px-5"
          onClick={() => handlePlaySong(track.uri, track.id)}
        >
          <div className="flex space-x-5">
            <p className="text-gray-500">{i + 1}</p>
            <h3 className="w-52 truncate pr-4 sm:w-80">{track.name}</h3>
          </div>
          <p className="text-gray-500">
            {millisToMinutesAndSeconds(track.duration_ms)}
          </p>
        </div>
      ))}
      {loadMore ? (
        <div className="flex justify-center">
          <button
            onClick={() => fetchMore(next)}
            className="rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
          >
            Load more...
          </button>
        </div>
      ) : null}
    </div>
  );
}
