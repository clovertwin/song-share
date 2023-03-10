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
  const [likedOpen, setLikedOpen] = useRecoilState(likedSongsOpenState);
  const [playlistOpen, setPlaylistOpen] = useRecoilState(playlistOpenState);
  const [playListComponentOpen, setPlaylistComponentOpen] = useRecoilState(
    playListComponentOpenState
  );
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [libraryOpen, setLibraryOpen] = useRecoilState(
    libraryComponentOpenState
  );
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const setCurrentPlayingType = useSetRecoilState(currentPlayingTypeState);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
      spotifyApi.getMySavedTracks().then((data) => {
        setLikedSongs(data.body.items);
      });
    }
  }, [spotifyApi, session]);

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
    <section className="bg-black h-screen w-full overflow-y-scroll scrollbar-hide text-white pb-36">
      <div className="flex items-center space-x-5 py-5 px-3">
        <Image
          alt="profile picture"
          src={session?.user.image as string}
          height={300}
          width={300}
          className="h-10 w-10 rounded-full"
        />
        <h1 className="text-2xl font-bold">Your Library</h1>
      </div>
      <div className="flex px-3 pb-5 space-x-5 text-sm">
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
      {likedOpen &&
        likedSongs.map((song, i) => (
          <div
            className="flex py-2 px-3 items-center space-x-5 rounded-lg hover:bg-gray-900"
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
            <div className="overflow-hidden">
              <h3 className="font-bold w-full truncate">
                {song.track.artists[0].name}
              </h3>
              <p className="text-gray-500 w-full truncate">{song.track.name}</p>
            </div>
          </div>
        ))}
      {playlistOpen &&
        playlists &&
        playlists.map((playlist, i) => (
          <div
            key={playlist.id}
            className="flex items-center py-2 rounded-lg space-x-5 px-3 overflow-hidden hover:bg-gray-900"
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
                className="h-12 w-12"
              />
            ) : (
              <div className="flex justify-center items-center h-12 w-12 text-xs text-center bg-gray-900">
                No Image
              </div>
            )}
            <h3 className="font-bold truncate">{playlist.name}</h3>
          </div>
        ))}
    </section>
  );
}
