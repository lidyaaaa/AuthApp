import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: { destination: "/dashboard", permanent: false },
    };
  }

  return {
    redirect: { destination: "/login", permanent: false },
  };
}

export default function Home() {
  return null;
}
