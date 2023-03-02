import { Button } from "./Button";
import Image from "next/image";
import logo from "../../public/Spotify_Logo_CMYK_Green.png";

export default async function Page() {
  return (
    <div className="h-screen bg-black flex flex-col space-y-7 sm:space-y-10 justify-center items-center xl:space-y-12">
      <Image
        className="max-w-[16rem] sm:max-w-sm xl:max-w-md"
        alt="spotify logo"
        src={logo}
        priority={true}
      />
      <Button />
    </div>
  );
}
