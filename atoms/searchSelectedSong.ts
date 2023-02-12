import { atom } from "recoil";

export const searchSelectedSongState = atom({
  key: "searchSelectedSongState",
  default: {} as SpotifyApi.TrackObjectFull,
});
