// pages/cart.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ambil cart
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

  useEffect(() => {
    fetchCart();
  }, []);

  // hapus item
  async function removeItem(id) {
    if (!confirm("Hapus item?")) return;

    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    fetchCart();
    window.dispatchEvent(new Event("cartUpdated")); // update icon
  }

  // update quantity
  async function updateQty(id, qty) {
    if (qty < 1) return;

    await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });

    fetchCart();
    window.dispatchEvent(new Event("cartUpdated")); // update icon
  }

  // redirect ke checkout page
  function handleCheckout() {
    if (items.length === 0) return alert("Cart kosong!");
    router.push("/checkout");
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) return (
    <Layout><p>Loading cart...</p></Layout>
  );

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Keranjang Belanja</h4>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/dashboard")}>
          ← Kembali ke Dashboard
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted">Cart kosong</p>
      ) : (
        <>
          <div className="card p-3 mb-3">
            {items.map(item => (
              <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div className="d-flex align-items-center gap-3">
                  <img src={item.product.image || "/no-image.png"} width={60} height={60} style={{objectFit:"cover"}} />
                  <div>{item.product.name}</div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div>Rp {(item.product.price * item.quantity).toLocaleString()}</div>

                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-secondary" disabled={item.quantity <=1} onClick={()=>updateQty(item.id,item.quantity-1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={()=>updateQty(item.id,item.quantity+1)}>+</button>
                  </div>

                  <button className="btn btn-danger btn-sm" onClick={()=>removeItem(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <h5>Total: Rp {total.toLocaleString()}</h5>
            <button className="btn btn-success" onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </Layout>
  );
}