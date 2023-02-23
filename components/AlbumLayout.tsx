import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { searchSelectedAlbumState } from "../atoms/searchSelectedAlbum";
import {
  albumComponentOpenState,
  selectedAlbumIdState,
} from "../atoms/albumAtom";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
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
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectSimplified[]>([]);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && albumId) {
      spotifyApi.getAlbum(albumId).then((data) => {
        setAlbum(data.body);
      });
      spotifyApi.getAlbumTracks(albumId).then((data) => {
        setTracks(data.body.items);
      });
    }
  }, [spotifyApi, setAlbum, albumId]);

  const handlePlaySong = (uri: string, id: string) => {
    setCurrentTrackId(id);
    setIsPlaying(true);
    spotifyApi.play({ uris: [uri] });
  };

  return (
    <div className="px-8">
      <ArrowLeftCircleIcon
        onClick={() => setAlbumComponentOpen(false)}
        className="text-gray-500 mb-5 h-10 w-10 hover:text-white hover:cursor-pointer"
      >
        Back
      </ArrowLeftCircleIcon>
      {album.images && (
        <div className="flex items-end space-x-10 pb-5">
          <Image
            alt={`${album.name} cover art`}
            src={album.images[0].url}
            height={album.images[0].height}
            width={album.images[0].width}
            className="w-40 h-40"
          />
          <div>
            <h1 className="pr-10 text-2xl font-bold truncate">{album.name}</h1>
            <p className="text-gray-500 text-lg">
              {album.release_date.split("-")[0]}
            </p>
          </div>
        </div>
      )}
      {tracks.map((track, i) => (
        <div
          key={i}
          className="flex justify-between items-center py-4 px-5 rounded-lg hover:cursor-pointer hover:bg-gray-900"
          onClick={() => handlePlaySong(track.uri, track.id)}
        >
          <div className="flex space-x-5">
            <p className="text-gray-500">{i + 1}</p>
            <h3>{track.name}</h3>
          </div>
          <p className="text-gray-500">
            {millisToMinutesAndSeconds(track.duration_ms)}
          </p>
        </div>
      ))}
    </div>
  );
}
