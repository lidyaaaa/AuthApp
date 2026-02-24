import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") fetchProducts();
  }, [status]);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  if (session?.user?.role !== "admin") {
    return <p>Akses ditolak</p>;
  }

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between mb-3">
        <h4>Products</h4>
      </div>

      {products.length === 0 ? (
        <p className="text-muted">Belum ada produk</p>
      ) : (
        <div className="row g-3 mb-4">
          {products.map((p) => (
            <div key={p.id} className="col-md-4">
              <div className="card shadow-sm p-3 h-100">
                <img src={p.image} className="img-fluid mb-2" />
                <h6>{p.name}</h6>
                <p>Rp {p.price.toLocaleString()}</p>

                {/* ADMIN BISA CRUD */}
                <div className="mt-2 d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      (window.location.href = `/admin/products/edit/${p.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                      if (!confirm("Hapus produk ini?")) return;
                      await fetch(`/api/products/${p.id}`, { method: "DELETE" });
                      fetchProducts();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}