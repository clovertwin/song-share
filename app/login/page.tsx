import { getProviders } from "next-auth/react";
import { Button } from "../../components/Button";

async function getData() {
  const providers = await getProviders();
  if (providers?.spotify) {
    return providers;
  }
}

export default async function Login() {
  const data = await getData();
  console.log(data);
  return <Button data={data} />;
}
