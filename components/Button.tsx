"use client";
import { signIn, ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";

interface ButtonProps {
  data:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | undefined;
}

export const Button = ({ data }: ButtonProps) => {
  return (
    <button
      onClick={() => signIn(data?.spotify.id, { callbackUrl: "/" })}
      className="px-14 py-4 bg-slate-500 text-neutral-50 hover:bg-spotifyPrimary"
    >
      Login with {data?.spotify.name}
    </button>
  );
};
