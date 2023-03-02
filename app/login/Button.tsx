"use client";
import { signIn } from "next-auth/react";

export const Button = () => {
  return (
    <button
      onClick={() => signIn("spotify", { callbackUrl: "/" })}
      className="px-10 rounded-md py-1 text-gray-500 bg-gray-900 sm:py-2 sm:text-xl sm:px-14 hover:no-underline hover:text-spotifyPrimary focus:outline-none focus:bg-gray-900 focus:ring focus:ring-gray-700 active:text-gray-500 active:bg-black"
    >
      Login
    </button>
  );
};
