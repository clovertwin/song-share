import { getProviders } from "next-auth/react";
import Login from "./Login";

export default async function Page() {
  const provider = await getProviders();
  return <Login provider={provider} />;
}
