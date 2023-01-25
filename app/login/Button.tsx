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
      className="text-lg text-gray-500 hover:text-spotifyPrimary"
    >
      Login with {provider?.spotify.name} account
    </button>
  );
};
