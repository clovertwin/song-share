import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Home from "./Home";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return <Home session={session} />;
}
