import SpotifyWebApi from "spotify-web-api-node";

/**
 * user-read-email: Read access to user’s email address.
 *
 * user-read-private: Read access to user’s subscription details (type of user account).
 *
 * streaming: Control playback of a Spotify track. This scope is currently available
 * to the Web Playback SDK. The user must have a Spotify Premium account.
 */

const scopes = [
  "user-read-email",
  "user-read-private",
  "user-read-colaborative",
  "streaming",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

export default spotifyApi;
