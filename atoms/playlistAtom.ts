import { atom } from "recoil";

export const playlistState = atom<SpotifyApi.SinglePlaylistResponse>({
  key: "playlistState",
  default: undefined,
});

export const playlistIdState = atom({
  key: "playlistIdState",
  default: "2ikkUzxTTfEAJ6aZ3CvC0a",
});
