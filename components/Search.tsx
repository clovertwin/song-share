import { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchOpenState } from "../atoms/searchAtom";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth";
import ArtistSearch from "./AritistSearch";
import AlbumSearch from "./AlbumSearch";
import SongSearch from "./SongSearch";
import ShowSearch from "./ShowSearch";
import { artistSearchOpenState } from "../atoms/searchSelectedArtist";
import ArtistLayout from "./ArtistLayout";
import { artistComponentOpenState } from "../atoms/artistAtom";
import { albumSearchOpenState } from "../atoms/searchSelectedAlbum";
import { albumComponentOpenState } from "../atoms/albumAtom";
import AlbumLayout from "./AlbumLayout";
import { songSearchOpenState } from "../atoms/searchSelectedSong";
import ShowLayout from "./ShowLayout";
import { showComponentOpenState } from "../atoms/showAtom";
import { showSearchOpenState } from "../atoms/searchSelectedShow";

interface Props {
  session: Session | null;
}

export default function Search({ session }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [artistSearchSelected, setArtistSearchSelected] = useState(true);
  const [albumSearchSelected, setAlbumSearchSelected] = useState(false);
  const [songSearchSelected, setSongSearchSelected] = useState(false);
  const [showSearchSelected, setShowSearchSelected] = useState(false);
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const [artistSearchOpen, setArtistSearchOpen] = useRecoilState(
    artistSearchOpenState
  );
  const [artistComponentOpen, setArtistComponentOpen] = useRecoilState(
    artistComponentOpenState
  );
  const [albumCompoentOpen, setAlbumComponentOpen] = useRecoilState(
    albumComponentOpenState
  );
  const [albumSearchOpen, setAlbumSearchOpen] =
    useRecoilState(albumSearchOpenState);
  const [songSearchOpen, setSongSearchOpen] =
    useRecoilState(songSearchOpenState);
  const [showComponentOpen, setShowComponentOpen] = useRecoilState(
    showComponentOpenState
  );
  const [showSearchOpen, setShowSearchOpen] =
    useRecoilState(showSearchOpenState);
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>([]);
  const [songs, setSongs] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [shows, setShows] = useState<SpotifyApi.ShowObjectSimplified[]>([]);
  const [next, setNext] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const spotifyApi = useSpotify(session);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearchTypeSelect = (
    type: "artist" | "album" | "song" | "show"
  ) => {
    switch (type) {
      case "artist":
        setArtistSearchSelected(true);
        setAlbumSearchSelected(false);
        setSongSearchSelected(false);
        setShowSearchSelected(false);
        break;
      case "album":
        setArtistSearchSelected(false);
        setAlbumSearchSelected(true);
        setSongSearchSelected(false);
        setShowSearchSelected(false);
        break;
      case "song":
        setArtistSearchSelected(false);
        setAlbumSearchSelected(false);
        setSongSearchSelected(true);
        setShowSearchSelected(false);
        break;
      case "show":
        setArtistSearchSelected(false);
        setAlbumSearchSelected(false);
        setSongSearchSelected(false);
        setShowSearchSelected(true);
        break;
      default:
        setArtistSearchSelected(true);
        setAlbumSearchSelected(false);
        setSongSearchSelected(false);
        setShowSearchSelected(false);
    }
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
        if (data.artists) {
          setArtists((prev) => [...prev, ...data.artists?.items]);
          setNext(data.artists?.next);
        } else if (data.albums) {
          setAlbums((prev) => [...prev, ...data.albums?.items]);
          setNext(data.albums?.next);
        } else if (data.tracks) {
          setSongs((prev) => [...prev, ...data.tracks?.items]);
          setNext(data.tracks?.next);
        } else if (data.shows) {
          setShows((prev) => [...prev, ...data.shows?.items]);
          setNext(data.shows?.next);
        }
      });
  };

  const handleSearch = () => {
    if (searchValue && artistSearchSelected) {
      spotifyApi.searchArtists(searchValue).then((data) => {
        if (data.body.artists) {
          setArtists(data.body.artists.items);
          if (data.body.artists.next) {
            setNext(data.body.artists.next);
          }
        }
      });
      setArtistSearchOpen(true);
    } else if (searchValue && albumSearchSelected) {
      spotifyApi.searchAlbums(searchValue).then((data) => {
        if (data.body.albums) {
          setAlbums(data.body.albums.items);
          if (data.body.albums.next) {
            setNext(data.body.albums.next);
          }
        }
      });
      setAlbumSearchOpen(true);
    } else if (searchValue && songSearchSelected) {
      spotifyApi.searchTracks(searchValue).then((data) => {
        if (data.body.tracks) {
          setSongs(data.body.tracks?.items);
          if (data.body.tracks.next) {
            setNext(data.body.tracks.next);
          }
        }
      });
      setSongSearchOpen(true);
    } else if (searchValue && showSearchSelected) {
      spotifyApi.searchShows(searchValue).then((data) => {
        if (data.body.shows) {
          setShows(data.body.shows?.items);
          if (data.body.shows.next) {
            setNext(data.body.shows.next);
          }
        }
      });
      setShowSearchOpen(true);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setArtists([]);
    setAlbums([]);
    setSongs([]);
    setShows([]);
    setArtistComponentOpen(false);
    setAlbumComponentOpen(false);
    setShowComponentOpen(false);
  };

  return (
    <div className="bg-black h-screen w-full overflow-y-scroll scrollbar-hide text-white pb-32">
      {/** Search Bar */}
      <div className="sticky top-0 flex flex-col pt-10 pb-5 px-10 bg-black">
        <div className="flex items-center justify-between pb-5 bg-black z-10">
          <div className="flex justify-center pr-5">
            <input
              ref={inputRef}
              className="ml-5 px-5 py-1 h-10 bg-black border-2 border-green-700 rounded-md focus:outline-none focus:border-green-400 focus:ring-green-500"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              type="text"
              name="search"
              id="search"
              placeholder={`search for ${
                albumSearchSelected
                  ? "albums"
                  : songSearchSelected
                  ? "songs"
                  : showSearchSelected
                  ? "shows"
                  : "artists"
              }..`}
              autoComplete="off"
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="ml-5 rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
            >
              search
            </button>
            <button
              onClick={handleClear}
              className="ml-5 rounded-md px-5 py-1 h-10 border-2 border-gray-800 text-gray-500 active:bg-gray-800 hover:border-gray-700 hover:text-white focus:text-white focus:outline-none focus:border-green-500 focus:ring-green-500"
            >
              clear
            </button>
          </div>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="mr-10 w-9 rounded-md border-2 border-gray-800 text-gray-500 active:bg-gray-900 hover:border-gray-700 focus:border-green-500 focus:text-white  focus:outline-none focus:ring-green-500 hover:cursor-pointer"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>
        <div className="flex items-center ml-5 space-x-5 bg-black">
          <button
            onClick={() => handleSearchTypeSelect("artist")}
            className={`border-2 ${
              artistSearchSelected
                ? `border-gray-700 text-white`
                : `border-gray-800 text-gray-500`
            } rounded-md py-1 px-5 text-sm 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
          >
            Artists
          </button>
          <button
            onClick={() => handleSearchTypeSelect("album")}
            className={`border-2 ${
              albumSearchSelected
                ? `border-gray-700 text-white`
                : `border-gray-800 text-gray-500`
            } rounded-md py-1 px-5 text-sm 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
          >
            Albums
          </button>
          <button
            onClick={() => handleSearchTypeSelect("song")}
            className={`border-2 ${
              songSearchSelected
                ? `border-gray-700 text-white`
                : `border-gray-800 text-gray-500`
            } rounded-md py-1 px-5 text-sm 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
          >
            Songs
          </button>
          <button
            onClick={() => handleSearchTypeSelect("show")}
            className={`border-2 ${
              showSearchSelected
                ? `border-gray-700 text-white`
                : `border-gray-800 text-gray-500`
            } rounded-md py-1 px-5 text-sm 800 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
          >
            Shows
          </button>
        </div>
      </div>
      {/** Search Results */}
      {artistSearchSelected && artistSearchOpen ? (
        <ArtistSearch artists={artists} fetchMore={fetchMore} next={next} />
      ) : artistSearchSelected && artistComponentOpen ? (
        <ArtistLayout session={session} />
      ) : null}
      {albumSearchSelected && albumSearchOpen ? (
        <AlbumSearch
          albums={albums}
          fetchMore={fetchMore}
          next={next}
          session={session}
        />
      ) : albumSearchSelected && albumCompoentOpen ? (
        <AlbumLayout session={session} />
      ) : null}
      {songSearchSelected && songSearchOpen ? (
        <SongSearch
          session={session}
          songs={songs}
          fetchMore={fetchMore}
          next={next}
        />
      ) : null}
      {showSearchSelected && showSearchOpen ? (
        <ShowSearch shows={shows} fetchMore={fetchMore} next={next} />
      ) : showSearchSelected && showComponentOpen ? (
        <ShowLayout session={session} />
      ) : null}
    </div>
  );
}
