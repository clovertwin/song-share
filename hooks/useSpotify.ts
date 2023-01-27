import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

export default function useSpotify() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (session) {
      // If refresh attempt fails, redirect user to login page
      //@ts-ignore
      if (session.error === "RefreshAccessTokenError") signIn();
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}
