import { Session } from "next-auth";
import useSpotify from "../hooks/useSpotify";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedShowId, showComponentOpenState } from "../atoms/showAtom";
import { searchSelectedShowState } from "../atoms/searchSelectedShow";

interface Props {
  session: Session | null;
}

export default function ShowLayout({ session }: Props) {
  const showId = useRecoilValue(selectedShowId);
  const [show, setShow] = useRecoilState(searchSelectedShowState);
  const setShowComponentOpen = useSetRecoilState(showComponentOpenState);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && showId) {
      spotifyApi.getShow(showId).then((data) => {
        setShow(data.body);
      });
    }
  }, [spotifyApi, setShow, showId]);

  return (
    <div className="flex justify-center items-center h-full w-full pb-36 text-white">
      <h1 className="pr-10">{show.name}</h1>
      <button
        onClick={() => setShowComponentOpen(false)}
        className="text-gray-500 hover:text-white"
      >
        close
      </button>
    </div>
  );
}
