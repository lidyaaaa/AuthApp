import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") fetchProducts();
  }, [status]);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function handleAddToCart(productId) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      alert("Produk masuk cart");
      router.push("/cart"); // langsung pindah halaman
    } else {
      alert("Gagal tambah ke cart");
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
      <h4 className="mb-3">Products</h4>

      {products.length === 0 ? (
        <p className="text-muted">Belum ada produk</p>
      ) : (
        <div className="row g-3">
          {products.map((p) => (
            <div key={p.id} className="col-md-4">
              <div className="card shadow-sm p-3 h-100">
                <img src={p.image} className="img-fluid mb-2" />
                <h6>{p.name}</h6>
                <p>Rp {p.price.toLocaleString()}</p>

                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleAddToCart(p.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}