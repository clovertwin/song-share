"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main className="text-lg text-center">
      <h1 className="pb-14 text-3xl">Welcome to SongShare!</h1>
      {status === "unauthenticated" ? (
        <Link className="underline underline-offset-3" href="/login">
          click here to login
        </Link>
      ) : (
        <button
          className="bg-slate-500 py-1 px-8 text-neutral-100 hover:bg-spotifyPrimary"
          onClick={() => signOut()}
        >
          Logout
        </button>
      )}
    </main>
  );
}
