"use client";
import { signIn } from "next-auth/react";

export const Button = () => {
  return (
    <button
      onClick={() => signIn("spotify", { callbackUrl: "/" })}
      className="text-xl px-4 rounded-md underline underline-offset-4 py-2 text-gray-500 hover:no-underline hover:text-spotifyPrimary hover:bg-gray-900 focus:outline-none focus:bg-gray-900 focus:ring focus:ring-gray-700 active:text-gray-500 active:bg-black"
    >
      Login
    </button>
  );
};
