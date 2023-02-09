import { atom } from "recoil";

export const searchArtistsState = atom({
  key: "searchArtistsState",
  default: [] as SpotifyApi.ArtistObjectFull[] | [],
});
