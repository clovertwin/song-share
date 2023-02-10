import { atom } from "recoil";

export const searchSelectedArtistState = atom({
  key: "searchSelectedAtristState",
  default: {} as SpotifyApi.ArtistObjectFull,
});
