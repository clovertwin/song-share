import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import Song from "./SongPage";

export default async function SongPage() {
  const session = await getServerSession(authOptions);
  return <Song session={session} />;
}
