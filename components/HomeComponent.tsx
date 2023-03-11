import { Session } from "next-auth";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

interface Props {
  session: Session | null;
}

export default function HomeComponent({ session }: Props) {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-white pb-36">
      <header className="absolute top-2 right-2 sm:top-5 sm:right-8">
        <div
          className="flex items-center bg-white bg-opacity-20 p-1 pr-2 space-x-3 opacity-90 hover:bg-opacity-50 cursor-pointer rounded-full"
          onClick={() => signOut()}
        >
          <Image
            className="rounded-full w-10 h-10"
            alt="photo of user"
            src={session?.user.image as string}
            height={300}
            width={300}
            priority={true}
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5, w-5" />
        </div>
      </header>
      <h1 className="font-bold text-xl">Home Page</h1>
      <p className="pt-5">under construction...</p>
    </div>
  );
}
