import { getProviders } from "next-auth/react";
import { Button } from "./Button";
import { unstable_getServerSession } from "next-auth/next";

async function getData() {
  const providers = await getProviders();
  if (providers?.spotify) {
    return providers;
  }
}

export default async function Login() {
  const responseProvider = await getData();
  const session = await unstable_getServerSession();
  return <Button responseProvider={responseProvider} />;
}
