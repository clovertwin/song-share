import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchSelectedArtistState } from "../atoms/searchSelectedArtist";
import {
  artistComponentOpenState,
  selectedArtistId,
} from "../atoms/artistAtom";

interface Props {
  session: Session | null;
}

export default function ArtistLayout({ session }: Props) {
  const artistId = useRecoilValue(selectedArtistId);
  const [artist, setArtist] = useRecoilState(searchSelectedArtistState);
  const [artistComponentOpen, setArtistComponentOpen] = useRecoilState(
    artistComponentOpenState
  );
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && artistId) {
      spotifyApi.getArtist(artistId).then((data) => {
        setArtist(data.body);
      });
    }
  }, [artist, spotifyApi, setArtist, artistId]);

  return (
    <div className="flex justify-center items-center w-full text-white">
      <h1 className="pr-10">{artist.name}</h1>
      <button
        onClick={() => setArtistComponentOpen(false)}
        className="text-gray-500 hover:text-white"
      >
        close
      </button>
    </div>
  );
}