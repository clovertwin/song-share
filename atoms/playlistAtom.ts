import { atom, RecoilState } from "recoil";

export const playlistState = atom<SpotifyApi.SinglePlaylistResponse>({
  key: "playlistState",
  default: undefined,
});

export const playlistIdState = atom({
  key: "playlistIdState",
  default: "Digital",
});
