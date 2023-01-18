import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS", refreshedToken);
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshedToken: refreshedToken.refresh_token ?? token.refreshToken, //Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      /**@ts-ignore todo: This is returning string | undefined */
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      /**@ts-ignore todo: This is returning string | undefined */
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**@ts-ignore todo: jwt is a complex type i don't understand */
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const example = {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          userName: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000,
        };
        console.log("JTW CALLBACK TOKEN: ", example);
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          userName: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000,
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }
      // Access token has expired, so we need to refresh it..
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      console.log("SESSION CALLBACK", token);
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.userName = token.userName;
      return session;
    },
  },
});
