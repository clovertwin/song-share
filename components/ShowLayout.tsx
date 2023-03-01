import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  showSearchOpenState,
  searchSelectedShowState,
} from "../atoms/searchSelectedShow";
import { showComponentOpenState, selectedShowIdState } from "../atoms/showAtom";
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
  const showId = useRecoilValue(selectedShowIdState);
  const [show, setShow] = useRecoilState(searchSelectedShowState);
  const setShowComponentOpen = useSetRecoilState(showComponentOpenState);
  const setShowSearchOpen = useSetRecoilState(showSearchOpenState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setCurrentPlayingType = useSetRecoilState(currentPlayingTypeState);
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const [episodes, setEpisodes] = useState<
    SpotifyApi.EpisodeObjectSimplified[]
  >([]);
  const [next, setNext] = useState("");
  const [loadMore, setLoadMore] = useState(false);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && showId) {
      spotifyApi.getShow(showId).then((data) => {
        setShow(data.body);
      });
      spotifyApi.getShowEpisodes(showId).then((data) => {
        setEpisodes(data.body.items);
        if (data.body.next) {
          setNext(data.body.next);
          setLoadMore(true);
        }
      });
    }
  }, [spotifyApi, setShow, showId]);

  const handlePlayEpisode = (uri: string, id: string) => {
    setCurrentTrackId(id);
    setCurrentPlayingType("episode");
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
        setEpisodes((prev) => [...prev, ...data.items]);
        if (data.next) {
          setNext(data.next);
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
      });
  };

  return (
    <div className="px-5 sm:px-8">
      <ArrowLeftCircleIcon
        onClick={() => {
          setShowComponentOpen(false);
          setShowSearchOpen(true);
        }}
        className="text-gray-500 mb-5 h-10 w-10 hover:text-white hover:cursor-pointer"
      >
        Back
      </ArrowLeftCircleIcon>
      {show.images && (
        <div className="flex items-center space-x-4 sm:space-x-10 pb-5">
          <Image
            alt={`${show.name} cover art`}
            src={show.images[0].url}
            height={show.images[0].height}
            width={show.images[0].width}
            className="w-16 h-16 sm:w-40 sm:h-40"
          />
          <div className="overflow-hidden">
            <h1 className="pr-10 text-2xl font-bold">{show.name}</h1>
          </div>
        </div>
      )}
      {episodes.map((episode, i) => (
        <div
          key={i}
          className="flex justify-between items-center py-4 rounded-lg hover:cursor-pointer hover:bg-gray-900 sm:px-5"
          onClick={() => handlePlayEpisode(episode.uri, episode.id)}
        >
          <div className="flex space-x-5">
            <p className="text-gray-500">{i + 1}</p>
            <h3 className="w-52 truncate pr-4 sm:w-80">{episode.name}</h3>
          </div>
          <p className="text-gray-500">
            {millisToMinutesAndSeconds(episode.duration_ms)}
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
