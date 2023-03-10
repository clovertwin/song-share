import { useEffect, useState } from "react";
import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import Image from "next/image";
import {
  libraryComponentOpenState,
  likedSongsOpenState,
  playlistOpenState,
} from "../atoms/libraryAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  playListComponentOpenState,
  playlistIdState,
} from "../atoms/playlistAtom";
import {
  currentPlayingTypeState,
  currentTrackIdState,
  isPlayingState,
} from "../atoms/songAtom";

interface Props {
  session: Session | null;
}

export default function Library({ session }: Props) {
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [likedSongs, setLikedSongs] = useState<SpotifyApi.SavedTrackObject[]>(
    []
  );
  const [nextTrack, setNextTrack] = useState("");
  const [nextPlaylist, setNextPlaylist] = useState("");
  const [loadMoreTracks, setLoadMoreTracks] = useState(false);
  const [loadMorePlaylists, setLoadMorePlaylists] = useState(false);
  const [likedOpen, setLikedOpen] = useRecoilState(likedSongsOpenState);
  const [playlistOpen, setPlaylistOpen] = useRecoilState(playlistOpenState);
  const setPlaylistComponentOpen = useSetRecoilState(
    playListComponentOpenState
  );
  const setPlaylistId = useSetRecoilState(playlistIdState);
  const setLibraryOpen = useSetRecoilState(libraryComponentOpenState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const setCurrentPlayingType = useSetRecoilState(currentPlayingTypeState);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
        if (data.body.next) {
          setNextPlaylist(data.body.next);
          setLoadMorePlaylists(true);
        }
      });
      spotifyApi.getMySavedTracks().then((data) => {
        setLikedSongs(data.body.items);
        if (data.body.next) {
          setNextTrack(data.body.next);
          setLoadMoreTracks(true);
        }
      });
    }
  }, [spotifyApi, session]);

  const fetchMore = (next: string, type: "playlist" | "track") => {
    fetch(next, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        Host: "api.spotify.com",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (type === "playlist") {
          setPlaylists((prev) => [...prev, ...data.items]);
          if (data.next) {
            setNextPlaylist(data.next);
            setLoadMorePlaylists(true);
          } else {
            setLoadMorePlaylists(false);
          }
        }
        if (type === "track") {
          setLikedSongs((prev) => [...prev, ...data.items]);
          if (data.next) {
            setNextTrack(data.next);
            setLoadMoreTracks(true);
          } else {
            setLoadMoreTracks(false);
          }
        }
      });
  };

  const handlePlaylistSelect = (
    playlist: SpotifyApi.PlaylistObjectSimplified
  ) => {
    setPlaylistId(playlist.id);
    setPlaylistComponentOpen(true);
    setLibraryOpen(false);
  };

  const playSong = (song: SpotifyApi.SavedTrackObject) => {
    setCurrentTrackId(song.track.id);
    setCurrentPlayingType("track");
    setIsPlaying(true);
    spotifyApi.play({
      uris: [song.track?.uri],
    });
  };

  return (
    <section className="bg-black h-screen w-full overflow-y-scroll scrollbar-hide text-white pb-36 sm:ml-14">
      <div className="flex items-center space-x-5 px-3 pt-14 pb-7 md:pt-20 md:pb-10">
        <Image
          alt="profile picture"
          src={session?.user.image as string}
          height={300}
          width={300}
          className="h-10 w-10 rounded-full sm:h-14 sm:w-14"
        />
        <h1 className="text-4xl font-bold text-spotifyPrimary md:text-5xl">
          Your Library
        </h1>
      </div>
      <div className="flex px-3 pb-7 space-x-5 text-sm md:pb-10">
        <button
          onClick={() => {
            setPlaylistOpen(true);
            setLikedOpen(false);
          }}
          className={`${
            playlistOpen ? "text-white" : "text-gray-500"
          } border-2 border-gray-800 rounded-md py-1 px-3 text-xs sm:text-sm sm:px-5 xl:px-10 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
        >
          Playlists
        </button>
        <button
          onClick={() => {
            setLikedOpen(true);
            setPlaylistOpen(false);
          }}
          className={`${
            likedOpen ? "text-white" : "text-gray-500"
          } border-2 border-gray-800 rounded-md py-1 px-3 text-xs sm:text-sm sm:px-5 xl:px-10 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
        >
          Liked Songs
        </button>
      </div>
      <div>
        {likedOpen &&
          likedSongs.map((song, i) => (
            <button
              className="flex w-full py-3 px-3 items-center space-x-5 rounded-lg md:space-x-10 hover:bg-gray-900 hover:cursor-pointer"
              key={song.track.id}
              onClick={() => playSong(song)}
            >
              <p className="text-gray-500">
                {i + 1 < 10 ? "0" + (i + 1) : i + 1}
              </p>
              <Image
                alt={`${song.track.album} cover art`}
                src={song.track.album.images[0].url}
                height={640}
                width={640}
                className="h-12 w-12"
              />
              <div className="overflow-hidden text-left">
                <h3 className="font-bold w-full truncate md:text-lg">
                  {song.track.artists[0].name}
                </h3>
                <p className="text-gray-500 w-full truncate">
                  {song.track.name}
                </p>
              </div>
            </button>
          ))}
        {likedOpen && loadMoreTracks ? (
          <div className="flex justify-center pt-3">
            <button
              onClick={() => fetchMore(nextTrack, "track")}
              className="rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
            >
              Load more...
            </button>
          </div>
        ) : null}
      </div>
      <div>
        {playlistOpen &&
          playlists &&
          playlists.map((playlist, i) => (
            <button
              key={playlist.id}
              className="flex items-center w-full py-3 rounded-lg space-x-5 px-3 md:space-x-10 hover:bg-gray-900 hover:cursor-pointer"
              onClick={() => handlePlaylistSelect(playlist)}
            >
              <p className="text-gray-500">
                {i + 1 < 10 ? "0" + (i + 1) : i + 1}
              </p>
              {playlist.images.length > 0 ? (
                <Image
                  alt={`${playlist.name} cover image`}
                  src={playlist.images[0]?.url}
                  height={640}
                  width={640}
                  className="h-12 w-12 md:h-14 md:w-14"
                />
              ) : (
                <div className="flex justify-center items-center h-12 w-12 text-xs text-center bg-gray-900 md:h-14 md:w-14">
                  No Image
                </div>
              )}
              <h3 className="font-bold truncate">{playlist.name}</h3>
            </button>
          ))}
        {playlistOpen && loadMorePlaylists ? (
          <div className="flex justify-center">
            <button
              onClick={() => fetchMore(nextPlaylist, "playlist")}
              className="rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
            >
              Load more...
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
