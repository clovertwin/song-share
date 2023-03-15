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
      <div className="h-60 pb-8 bg-gradient-to-b from-spotifyPrimary to-black">
        <header className="flex justify-end p-2 sm:pt-8 sm:pr-8">
          <div
            className="flex items-center justify-between bg-white bg-opacity-20 p-1 pr-4 w-40 opacity-90 hover:bg-opacity-50 cursor-pointer rounded-full"
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
            <h2 className="pr-5 text-lg">Logout</h2>
          </div>
        </header>
        <h1 className="font-bold text-5xl pt-10 pl-3 pb-3 sm:text-6xl lg:pl-6">
          Song-Share
        </h1>
      </div>
      {artistOpen ? (
        <ArtistLayout session={session} />
      ) : (
        <div>
          <h2 className="pt-5 pb-3 pl-3 text-xl font-bold lg:pl-8">
            Top Artists:
          </h2>
          {topArtists
            ? topArtists.map((artist, i) => (
                <div
                  key={i}
                  className="text-gray-500 flex items-center py-3 pl-3 space-x-5 rounded-lg lg:pl-12 hover:text-white hover:cursor-pointer hover:bg-gray-900"
                  onClick={() => handleArtistSelect(artist.id)}
                >
                  <p>{i + 1 < 10 ? "0" + (i + 1) : i + 1}</p>
                  <Image
                    alt="artist image"
                    src={artist.images[0].url}
                    width={artist.images[0].width}
                    height={artist.images[0].height}
                    className="h-12 w-12"
                  />
                  <h3 className="text-white">{artist.name}</h3>
                </div>
              ))
            : null}
          <h2 className="pt-10 pb-3 pl-3 text-xl font-bold lg:pl-8">
            Top Tracks:
          </h2>
          {topTracks
            ? topTracks.map((track, i) => (
                <div
                  key={i}
                  onClick={() => handleTrackSelect(track)}
                  className="text-gray-500 flex items-center space-x-5 py-3 pl-3 rounded-lg lg:pl-12 hover:text-white hover:cursor-pointer hover:bg-gray-900"
                >
                  <p>{i + 1 < 10 ? "0" + (i + 1) : i + 1}</p>
                  <Image
                    alt="album cover art"
                    src={track.album.images[0].url}
                    width={640}
                    height={640}
                    className="h-12 w-12"
                  />
                  <div>
                    <h3 className="text-white">{track.artists[0].name}</h3>
                    <p className="truncate w-52">{track.name}</p>
                  </div>
                </div>
              ))
            : null}
        </div>
      )}
    </div>
  );
}
