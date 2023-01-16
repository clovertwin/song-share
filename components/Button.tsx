"use client";
import { signIn, ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";

interface ButtonProps {
  responseProvider:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | undefined;
}

export const Button = ({ responseProvider }: ButtonProps) => {
  return (
    <button
      onClick={() => signIn(responseProvider?.spotify.id, { callbackUrl: "/" })}
      className="px-14 py-4 bg-slate-500 text-neutral-50 hover:bg-spotifyPrimary"
    >
      Login with {responseProvider?.spotify.name}
    </button>
  );
};
