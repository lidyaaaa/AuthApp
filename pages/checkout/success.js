import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <Layout>
      <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: "60vh" }}>
        
        <h2 className="text-success mb-3">🎉 Pembayaran Berhasil!</h2>
        
        <p className="text-muted mb-4">
          Terima kasih sudah memesan di Kayzhaakies 💖
        </p>

        <button
          className="btn btn-primary"
          onClick={() => router.push("/dashboard")}
        >
          Kembali ke Dashboard
        </button>
      </div>
    </Layout>
  );
}