import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminProducts() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (session?.user.role === "admin") fetchProducts();
  }, [session]);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  async function handleDelete(id) {
    if (!confirm("Hapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  if (!session) return null;
  if (session.user.role !== "admin") return <p>Akses ditolak</p>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between mb-4">
        <h2>Manage Products</h2>
        <button
          className="btn btn-success"
          onClick={() => router.push("/admin/products/create")}
        >
          + Add Product
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th style={{ width: 160 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>Rp {p.price.toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        router.push(`/admin/products/edit/${p.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    Belum ada produk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
