import { useEffect, useState } from "react";
import { Session } from "next-auth";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import ArtistLayout from "./ArtistLayout";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  selectedArtistId,
  artistComponentOpenState,
} from "../atoms/artistAtom";
import {
  currentPlayingTypeState,
  currentTrackIdState,
  isPlayingState,
} from "../atoms/songAtom";

interface Props {
  session: Session | null;
}

export default function HomeComponent({ session }: Props) {
  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>(
    []
  );
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [artistOpen, setArtistOpen] = useRecoilState(artistComponentOpenState);
  const setArtistId = useSetRecoilState(selectedArtistId);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const setCurrentPlayingType = useSetRecoilState(currentPlayingTypeState);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    spotifyApi.getMyTopArtists({ limit: 10 }).then((data) => {
      if (data.body.items.length > 0) {
        setTopArtists(data.body.items);
      }
    });
    spotifyApi.getMyTopTracks({ limit: 10 }).then((data) => {
      if (data.body.items.length > 0) {
        setTopTracks(data.body.items);
      }
    });
  }, [spotifyApi]);

  const handleArtistSelect = (id: string) => {
    setArtistId(id);
    setArtistOpen(true);
  };

  const handleTrackSelect = (track: SpotifyApi.TrackObjectFull) => {
    setCurrentTrackId(track.id);
    setCurrentPlayingType("track");
    setIsPlaying(true);
    spotifyApi.play({ uris: [track.uri] });
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-y-scroll scrollbar-hide text-white pb-36">
      <header className="absolute top-2 right-2 sm:top-5 sm:right-8">
        <div
          className="flex items-center bg-white bg-opacity-20 p-1 pr-2 space-x-3 opacity-90 hover:bg-opacity-50 cursor-pointer rounded-full"
          onClick={() => signOut()}
        >
          <Image
            className="rounded-full w-10 h-10"
            alt="photo of user"
            src={session?.user.image as string}
            height={300}
            width={300}
            priority={true}
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5, w-5" />
        </div>
      </header>
      <h1 className="font-bold text-4xl pt-20 pb-3">Home</h1>
      {artistOpen ? (
        <ArtistLayout session={session} />
      ) : (
        <div>
          <h2 className="pt-5 text-lg font-bold">Top Artists:</h2>
          <ul className="pt-5 hover:cursor-pointer">
            {topArtists
              ? topArtists.map((artist, i) => (
                  <li
                    key={i}
                    className="text-gray-500 hover:text-white"
                    onClick={() => handleArtistSelect(artist.id)}
                  >
                    {artist.name}
                  </li>
                ))
              : null}
          </ul>
          <h2 className="pt-5 text-lg font-bold">Top Tracks:</h2>
          <ul className="pt-5 hover:cursor-pointer">
            {topTracks
              ? topTracks.map((track, i) => (
                  <li
                    key={i}
                    onClick={() => handleTrackSelect(track)}
                    className="text-gray-500 truncate w-3/4 hover:text-white"
                  >
                    {track.name}
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </div>
  );
}
