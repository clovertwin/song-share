import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import Artist from "./AlbumPage";

export default async function AlbumPage() {
  const session = await getServerSession(authOptions);
  return <Artist session={session} />;
}
