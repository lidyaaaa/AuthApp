import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();

  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH + FILTER =================
  useEffect(() => {
    if (!router.isReady) return;

    const selectedIds = JSON.parse(router.query.items || "[]");

    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) =>
          selectedIds.includes(item.id)
        );
        setCarts(filtered);
        setLoading(false);
      });
  }, [router.isReady]);

  // ================= QTY =================
  async function handleIncrease(item) {
    const res = await fetch(`/api/cart/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity: item.quantity + 1,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message);
      return;
    }

    refresh();
  }

  async function handleDecrease(item) {
    const newQty = item.quantity - 1;

    // kalau 0 → delete
    if (newQty <= 0) {
      await fetch(`/api/cart/${item.id}`, {
        method: "DELETE",
      });
    } else {
      await fetch(`/api/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: newQty,
        }),
      });
    }

    refresh();
  }

  function refresh() {
    const selectedIds = JSON.parse(router.query.items || "[]");

    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) =>
          selectedIds.includes(item.id)
        );
        setCarts(filtered);
      });
  }

  // ================= TOTAL =================
  const totalHarga = carts.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-transparent border-0 p-4 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-1">🧾 Checkout</h4>
            <p className="text-secondary mb-0">
              Pastikan pesanan kamu sudah benar
            </p>
          </div>

          {/* BACK */}
          <Link href="/cart" className="btn btn-outline-dark">
            ← Kembali
          </Link>
        </div>

        <div className="card-body p-4">
          {carts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-secondary">
                Tidak ada item untuk checkout
              </p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Harga</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {carts.map((item) => (
                      <tr key={item.id}>
                        {/* PRODUK */}
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.product?.image || "/no-image.png"}
                              alt=""
                              width={60}
                              height={60}
                              style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <span className="fw-semibold">
                              {item.product?.name}
                            </span>
                          </div>
                        </td>

                        <td>
                          Rp {item.product?.price?.toLocaleString()}
                        </td>

                        {/* QTY */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              onClick={() => handleDecrease(item)}
                              className="btn btn-sm btn-outline-dark"
                            >
                              -
                            </button>

                            <span className="fw-bold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => handleIncrease(item)}
                              disabled={
                                item.quantity >= item.product.stock
                              }
                              className="btn btn-sm btn-dark"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* SUBTOTAL */}
                        <td>
                          Rp{" "}
                          {(item.quantity * item.product.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTAL */}
              <div className="d-flex justify-content-between align-items-center mt-4">
                <h5 className="fw-bold">
                  Total: Rp {totalHarga.toLocaleString()}
                </h5>

                <button className="btn btn-success">
                  Bayar Sekarang
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .rounded-4 {
          border-radius: 1rem;
        }
      `}</style>
    </Layout>
  );
}