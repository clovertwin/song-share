import { getProviders } from "next-auth/react";
import { Button } from "./Button";
import Image from "next/image";
import logo from "../../public/Spotify_Logo_CMYK_Green.png";

export default async function Login() {
  const provider = await getProviders();
  return (
    <div className="h-screen bg-black flex flex-col justify-center items-center">
      <Image
        className="max-w-[16rem] mb-5 sm:max-w-sm sm:mb-14"
        alt="spotify logo"
        src={logo}
        priority={true}
      />
      <Button provider={provider} />
    </div>
  );
}
