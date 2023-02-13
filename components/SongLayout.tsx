import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  searchSelectedSongState,
  songIdState,
} from "../atoms/searchSelectedSong";
import { songComponentOpenState } from "../atoms/searchSelectedSong";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";

interface Props {
  session: Session | null;
}

export default function SongLayout({ session }: Props) {
  const songId = useRecoilValue(songIdState);
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const [song, setSong] = useRecoilState(searchSelectedSongState);
  const setSongComponentOpen = useSetRecoilState(songComponentOpenState);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && songId) {
      spotifyApi.getTrack(songId).then((data) => {
        setSong(data.body);
      });
    }
  }, [song, spotifyApi, setSong, songId]);

  const handlePlaySong = () => {
    setCurrentTrackId(song.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [song.uri],
    });
  };

  return (
    <div className="flex justify-center items-center w-full text-white">
      <button onClick={handlePlaySong} className="pr-10">
        {song.name}
      </button>
      <button
        onClick={() => setSongComponentOpen(false)}
        className="text-gray-500 hover:text-white"
      >
        close
      </button>
    </div>
  );
}
