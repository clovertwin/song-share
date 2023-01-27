"use client";
import { signIn, ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";

interface ButtonProps {
  provider:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | undefined;
}

export const Button = ({ provider }: ButtonProps) => {
  return (
    <button
      onClick={() => signIn(provider?.spotify.id, { callbackUrl: "/" })}
      className="text-lg px-4 rounded-md py-2 text-gray-500 hover:text-spotifyPrimary hover:bg-gray-900 focus:outline-none focus:bg-gray-900 focus:ring focus:ring-gray-700 active:text-gray-500 active:bg-black"
    >
      Login with {provider?.spotify.name} account
    </button>
  );
};
