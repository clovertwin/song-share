import { atom } from "recoil";

export const searchSelectedAlbumState = atom({
  key: "searchSelectedAlbumState",
  default: {} as SpotifyApi.SingleAlbumResponse,
});

export const albumSearchOpenState = atom({
  key: "albumSearchOpenState",
  default: false,
});
