import { useEffect, useRef, useState } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { Session } from "next-auth";
import ArtistSearch from "./AritistSearch";
import AlbumSearch from "./AlbumSearch";
import SongSearch from "./SongSearch";
import ShowSearch from "./ShowSearch";
import SelectorButton from "./SelectorButton";
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

interface SearchProps {
  session: Session | null;
}

export default function Search({ session }: SearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [artistSearchSelected, setArtistSearchSelected] = useState(true);
  const [albumSearchSelected, setAlbumSearchSelected] = useState(false);
  const [songSearchSelected, setSongSearchSelected] = useState(false);
  const [showSearchSelected, setShowSearchSelected] = useState(false);
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

  const handleSearchTypeSelect = (type: string) => {
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
    <div className="bg-black h-screen w-full overflow-y-scroll scrollbar-hide text-white pb-36">
      {/** Search Bar */}
      <div className="sticky top-0 flex flex-col pb-2 pt-4 bg-black sm:pt-10 sm:px-8">
        <div className="flex items-center justify-between pb-4 bg-black z-10">
          <div className="flex items-center justify-center">
            <input
              ref={inputRef}
              className="ml-5 px-5 py-1 h-10 bg-black border-2 w-52 border-green-700 rounded-md sm:w-80 focus:outline-none focus:border-green-400 focus:ring-green-500 xl:w-[500px]"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              type="text"
              name="search"
              id="search"
              placeholder={`Search for ${
                albumSearchSelected
                  ? "albums"
                  : songSearchSelected
                  ? "songs"
                  : showSearchSelected
                  ? "shows"
                  : "artists"
              }...`}
              autoComplete="off"
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />
            <XMarkIcon
              onClick={handleClear}
              className="h-9 py-1 px-2 ml-2 text-gray-500 hover:text-white focus:text-white"
            />
            <MagnifyingGlassIcon
              onClick={handleSearch}
              className="px-2 py-1 h-8 text-gray-500 hover:text-white focus:text-white"
            />
          </div>
        </div>
        <div className="flex items-center ml-5 space-x-3 bg-black">
          {/** Search-type selector buttons */}
          {[
            { type: "artist", isSelected: artistSearchSelected },
            { type: "album", isSelected: albumSearchSelected },
            { type: "song", isSelected: songSearchSelected },
            { type: "show", isSelected: showSearchSelected },
          ].map((search, i) => (
            <SelectorButton
              key={i}
              handleSearchTypeSelect={handleSearchTypeSelect}
              searchType={search.type}
              selected={search.isSelected}
            />
          ))}
        </div>
      </div>
      {/** Search Results */}
      {artistSearchSelected && artistSearchOpen ? (
        <ArtistSearch artists={artists} fetchMore={fetchMore} next={next} />
      ) : artistSearchSelected && artistComponentOpen ? (
        <ArtistLayout session={session} />
      ) : null}
      {albumSearchSelected && albumSearchOpen ? (
        <AlbumSearch albums={albums} fetchMore={fetchMore} next={next} />
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
