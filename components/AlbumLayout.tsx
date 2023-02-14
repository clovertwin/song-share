import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { searchSelectedAlbumState } from "../atoms/searchSelectedAlbum";
import { albumComponentOpenState, selectedAlbumId } from "../atoms/albumAtom";

interface Props {
  session: Session | null;
}

export default function AlbumLayout({ session }: Props) {
  const albumId = useRecoilValue(selectedAlbumId);
  const [album, setAlbum] = useRecoilState(searchSelectedAlbumState);
  const setAlbumComponentOpen = useSetRecoilState(albumComponentOpenState);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && albumId) {
      spotifyApi.getAlbum(albumId).then((data) => {
        setAlbum(data.body);
      });
    }
  }, [spotifyApi, setAlbum, albumId]);

  return (
    <div className="flex justify-center items-center w-full text-white">
      <h1 className="pr-10">{album.name}</h1>
      <button
        onClick={() => setAlbumComponentOpen(false)}
        className="text-gray-500 hover:text-white"
      >
        close
      </button>
    </div>
  );
}
