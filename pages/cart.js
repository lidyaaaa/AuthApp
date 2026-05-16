import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();

  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [itemNotes, setItemNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);
  const isFirstFetch = useRef(true);

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= FETCH =================
  async function fetchCart(preserveNotes = false) {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) {
        setCarts([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setCarts(data);
      setLoading(false);

      // Hanya set selectedIds di load pertama
      if (isFirstFetch.current) {
        const preselected = data.map((item) => item.id);
        setSelectedIds(new Set(preselected));
        isFirstFetch.current = false;
      }

      // Init notes hanya di load pertama (jika tidak preserve)
      if (!preserveNotes && isFirstFetch.current === false) {
        const initialNotes = {};
        data.forEach((item) => {
          if (item.note) initialNotes[item.id] = item.note;
        });
        setItemNotes(initialNotes);
      }
    } catch (error) {
      console.log("Gagal load cart:", error);
      setLoading(false);
    }
  }
  // ================= SELECTION =================
  const allSelected = carts.length > 0 && selectedIds.size === carts.length;

  function toggleSelect(id) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(carts.map((item) => item.id)));
    }
  }

  // ================= QTY =================
  async function handleIncrease(item) {
    const res = await fetch(`/api/cart/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: item.quantity + 1 }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message);
      return;
    }

    const updated = await res.json();
    setCarts((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
    window.dispatchEvent(new Event("cartUpdated"));
  }

  async function handleDecrease(item) {
    const newQty = item.quantity - 1;

    if (newQty <= 0) {
      if (!confirm("Hapus item dari keranjang?")) return;
      const res = await fetch(`/api/cart/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }
      // Remove from state
      setCarts((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      const res = await fetch(`/api/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }
      const updated = await res.json();
      setCarts((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
    }

    window.dispatchEvent(new Event("cartUpdated"));
  }

  // ================= NOTES =================
  function handleNoteChange(id, value) {
    setItemNotes((prev) => ({ ...prev, [id]: value }));
  }

  async function handleNoteBlur(itemId) {
    const note = itemNotes[itemId] || "";
    setSavingNoteId(itemId);
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
    } catch (error) {
      console.error("Gagal simpan catatan:", error);
    } finally {
      setSavingNoteId(null);
    }
  }

  // ================= TOTAL =================
  const selectedCarts = carts.filter(
    (item) => selectedIds.has(item.id) && item.product
  );
  const totalHarga = selectedCarts.reduce(
    (total, item) => total + item.quantity * (item.product?.price || 0),
    0
  );

  // ================= CHECKOUT =================
  async function handleCheckout() {
    if (selectedCarts.length === 0) {
      alert("Pilih minimal 1 barang");
      return;
    }

    // Pastikan catatan sudah tersimpan di server
    const savePromises = selectedCarts.map(async (item) => {
      const noteValue = itemNotes[item.id] || "";
      try {
        await fetch(`/api/cart/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: noteValue }),
        });
      } catch (error) {
        console.error("Gagal simpan catatan:", error);
      }
    });

    await Promise.all(savePromises);

    // Navigate ke halaman checkout dengan item terpilih
    const query = JSON.stringify(selectedCarts.map((item) => ({ id: item.id })));
    router.push({
      pathname: "/checkout",
      query: { items: query },
    });
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
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
            <h4 className="fw-bold mb-1">🛒 Keranjang Belanja</h4>
            <p className="text-secondary mb-0">
              Pilih barang yang ingin dipesan
            </p>
          </div>
          <Link href="/" className="btn btn-outline-dark">
            ← Kembali
          </Link>
        </div>

        <div className="card-body p-4">
          {carts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-secondary">Keranjang kosong</p>
              <Link href="/user/products" className="btn btn-pink">
                Lihat Produk
              </Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Produk</th>
                      <th>Harga</th>
                      <th>Qty</th>
                      <th>Catatan Item</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {carts.map((item) => (
                      <tr key={item.id}>
                        {/* CHECKBOX */}
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelect(item.id)}
                          />
                        </td>

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
                            <span className="fw-bold">{item.quantity}</span>
                            <button
                              onClick={() => handleIncrease(item)}
                              disabled={item.quantity >= (item.product?.stock || 0)}
                              className="btn btn-sm btn-dark"
                            >
                              +
                            </button>
                          </div>
                          {item.product && item.product.stock < 5 && (
                            <small className="text-danger">
                              Tersisa {item.product.stock}
                            </small>
                          )}
                        </td>

                        {/* CATATAN ITEM */}
                        <td style={{ minWidth: "200px" }}>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Catatan (opsional)"
                            value={itemNotes[item.id] || item.note || ""}
                            onChange={(e) =>
                              handleNoteChange(item.id, e.target.value)
                            }
                            onBlur={() => handleNoteBlur(item.id)}
                            maxLength={200}
                          />
                          <small className="text-secondary">
                            {(itemNotes[item.id] || item.note || "").length}/200
                            {savingNoteId === item.id && " (menyimpan...)"}
                          </small>
                        </td>

                        {/* SUBTOTAL */}
                        <td>
                          Rp{" "}
                          {(item.quantity * item.product.price).toLocaleString()}
                        </td>

                        {/* HAPUS */}
                        <td>
                          <button
                            onClick={() => handleDecrease(item)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CHECKOUT SECTION */}
              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-secondary me-2">
                      {selectedCarts.length} item terpilih
                    </span>
                    <span className="fw-bold fs-5">
                      Total: Rp {totalHarga.toLocaleString()}
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={fetchCart}
                    >
                      Refresh
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={handleCheckout}
                      disabled={selectedCarts.length === 0}
                    >
                      Checkout ({selectedCarts.length})
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .btn-pink {
          background: #ff6b6b;
          color: white;
          border: none;
        }
      `}</style>
    </Layout>
  );
}
