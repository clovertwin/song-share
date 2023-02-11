import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import Artist from "./ArtistPage";

export default async function ArtistPage() {
  const session = await getServerSession(authOptions);
  return <Artist session={session} />;
}
