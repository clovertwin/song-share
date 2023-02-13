import { atom } from "recoil";

export const searchSelectedSongState = atom({
  key: "searchSelectedSongState",
  default: {} as SpotifyApi.TrackObjectFull,
});

export const songComponentOpenState = atom({
  key: "songComponentOpenState",
  default: false,
});

export const songIdState = atom({
  key: "songIdState",
  default: "",
});
