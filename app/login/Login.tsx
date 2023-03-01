"use client";
import { useEffect, useState } from "react";
import { LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { Button } from "./Button";
import Image from "next/image";
import logo from "../../public/Spotify_Logo_CMYK_Green.png";

interface Props {
  provider: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export default function Login({ provider }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col justify-center items-center">
      {mounted && (
        <>
          <Image
            className="max-w-[16rem] mb-5 sm:max-w-sm sm:mb-14"
            alt="spotify logo"
            src={logo}
            priority={true}
          />
          <Button provider={provider} />
        </>
      )}
    </div>
  );
}
