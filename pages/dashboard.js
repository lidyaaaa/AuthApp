import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout"; // pastikan path sesuai

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") fetchProducts();
  }, [status]);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      {/* Header + Profile */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0">Dashboard</h2>
          <small className="text-muted">
            Welcome back, {session.user.email}
          </small>
        </div>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </button>
      </div>

      {/* Products List */}
      <h4>Products</h4>
      {products.length === 0 ? (
        <p className="text-muted">Belum ada produk</p>
      ) : (
        <div className="row g-3 mb-4">
          {products.map((p) => (
            <div key={p.id} className="col-md-4">
              <div className="card shadow-sm p-3 h-100">
                <h6>{p.name}</h6>
                <p>Rp {p.price.toLocaleString()}</p>

                {/* Action hanya untuk admin */}
                {session.user.role === "admin" && (
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
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Manage Button */}
      {session.user.role === "admin" && (
        <div className="text-end mt-3">
          <a href="/admin/products" className="btn btn-primary">
            Manage Products
          </a>
        </div>
      )}
    </Layout>
  );
}
