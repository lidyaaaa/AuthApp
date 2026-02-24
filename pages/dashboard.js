import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }
  }, [status, session]);

  return (
    <Layout>
      <div className="text-center mt-5">Masuk ke dashboard...</div>
    </Layout>
  );
}