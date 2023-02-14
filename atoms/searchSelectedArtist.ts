import { atom } from "recoil";

export const searchSelectedArtistState = atom({
  key: "searchSelectedAtristState",
  default: {} as SpotifyApi.ArtistObjectFull,
});

export const artistSearchOpenState = atom({
  key: "artistSearchOpenState",
  default: false,
});
