import { atom } from "recoil";

export const searchSelectedSongState = atom({
  key: "searchSelectedSongState",
  default: {} as SpotifyApi.TrackObjectFull,
});

export const songSearchOpenState = atom({
  key: "songSearchOpenState",
  default: false,
});
