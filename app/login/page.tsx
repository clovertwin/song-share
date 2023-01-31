import { getProviders } from "next-auth/react";
import { Button } from "./Button";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import logo from "../../public/Spotify_Logo_CMYK_Green.png";

async function getData() {
  const provider = await getProviders();
  if (provider?.spotify) {
    return provider;
  }
}

export default async function Login() {
  const provider = await getData();
  const session = await getServerSession();
  return (
    <div className="h-screen bg-black flex flex-col justify-center items-center">
      <Image
        className="max-w-sm mb-14"
        alt="spotify logo"
        src={logo}
        priority={true}
      />
      <Button provider={provider} />
    </div>
  );
}
