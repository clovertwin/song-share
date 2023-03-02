import { Button } from "./Button";
import Image from "next/image";

export default async function Page() {
  return (
    <main className="h-screen bg-black flex flex-col space-y-7 justify-center items-center sm:space-y-10 xl:space-y-12">
      <Image
        className="max-w-[16rem] sm:max-w-sm xl:max-w-md"
        alt="spotify logo"
        src="https://res.cloudinary.com/diyccpxjc/image/upload/v1677735223/Spotify_Logo_CMYK_Green_psqumf.png"
        priority={true}
        width={2362}
        height={709}
      />
      <Button />
    </main>
  );
}
