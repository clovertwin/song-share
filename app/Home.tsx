"use client";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen bg-slate-50">
      <div className="flex flex-col justify-around items-center w-2/6 h-96 rounded-xl shadow-md">
        <button className="px-5 py-3 bg-green-500 rounded-lg hover:bg-green-600">
          Log into Spotify
        </button>
      </div>
    </main>
  );
}
