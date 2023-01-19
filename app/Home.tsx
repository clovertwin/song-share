"use client";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <main className="text-lg text-center">
      {status === "authenticated" && (
        <div>
          <h1 className="pb-14 text-3xl">{`Welcome ${session?.user.userName}`}</h1>
          <button
            onClick={() => signOut()}
            className="px-10 py-2 bg-slate-500 text-neutral-100 hover:bg-spotifyPrimary"
          >
            Logout
          </button>
        </div>
      )}
    </main>
  );
}
