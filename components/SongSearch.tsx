import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import {
  songComponentOpenState,
  songIdState,
} from "../atoms/searchSelectedSong";
import { searchOpenState } from "../atoms/searchAtom";

interface Props {
  songs: SpotifyApi.TrackObjectFull[];
}

export default function SongSearch({ songs }: Props) {
  const [songComponentOpen, setSongComponentOpen] = useRecoilState(
    songComponentOpenState
  );
  const [songId, setSongId] = useRecoilState(songIdState);
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);

  const handleSelect = (id: string) => {
    setSongId(id);
    setSongComponentOpen(true);
    setSearchOpen(false);
  };

  return (
    <div className="px-8">
      {songs.length > 0 &&
        songs.map((song) => (
          <div
            onClick={() => handleSelect(song.id)}
            key={song.id}
            className="flex items-center space-x-3 p-5 rounded-md text-gray-500 hover:text-white hover:cursor-pointer hover:bg-gray-900"
          >
            {song.album.images.length > 0 ? (
              <Image
                alt={`${song.album.name} image`}
                src={song.album.images[0]?.url}
                height={640}
                width={640}
                className="h-14 w-14"
              />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center bg-gray-800">
                <PhotoIcon className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <h1 className="text-lg ml-5">{song.name}</h1>
          </div>
        ))}
    </div>
  );
}
