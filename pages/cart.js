import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data);
    } catch (e) {
      alert("Gagal ambil cart");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(id) {
    if (!confirm("Hapus item?")) return;

    const res = await fetch(`/api/cart/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return alert("Gagal hapus item");
    }

    fetchCart();
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <Layout>
        <p>Loading cart...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Keranjang Belanja</h4>

        <button
          className="btn btn-outline-secondary"
          onClick={() => router.push("/dashboard")}
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted">Cart kosong</p>
      ) : (
        <>
          <div className="card p-3 mb-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={item.product.image || "/no-image.png"}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <div>{item.product.name}</div>
                    <small>Qty: {item.quantity}</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div>
                    Rp {(item.product.price * item.quantity).toLocaleString()}
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h5>Total: Rp {total.toLocaleString()}</h5>
        </>
      )}
    </Layout>
  );
}