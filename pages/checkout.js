import { useEffect, useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

const PAYMENT_METHODS = [
  {
    id: "COD",
    label: "COD (Bayar di Tempat)",
    desc: "Bayar tunai saat barang diterima",
    icon: "🛵",
    group: "cash",
  },
  {
    id: "Transfer_BCA",
    label: "Transfer BCA",
    desc: "Transfer via ATM/Internet Banking BCA",
    icon: "🏦",
    group: "bank",
    bankCode: "bca",
  },
  {
    id: "Transfer_Mandiri",
    label: "Transfer Mandiri",
    desc: "Transfer via ATM/Internet Banking Mandiri",
    icon: "🏦",
    group: "bank",
    bankCode: "mandiri",
  },
  {
    id: "Transfer_BRI",
    label: "Transfer BRI",
    desc: "Transfer via ATM/Internet Banking BRI",
    icon: "🏦",
    group: "bank",
    bankCode: "bri",
  },
  {
    id: "Transfer_BSI",
    label: "Transfer BSI",
    desc: "Transfer via ATM/Internet Banking BSI",
    icon: "🏦",
    group: "bank",
    bankCode: "bsi",
  },
  {
    id: "EWallet_GoPay",
    label: "GoPay",
    desc: "Bayar menggunakan GoPay",
    icon: "💚",
    group: "ewallet",
    ewalletCode: "gopay",
  },
  {
    id: "EWallet_OVO",
    label: "OVO",
    desc: "Bayar menggunakan OVO",
    icon: "🩷",
    group: "ewallet",
    ewalletCode: "ovo",
  },
  {
    id: "EWallet_ShopeePay",
    label: "ShopeePay",
    desc: "Bayar menggunakan ShopeePay",
    icon: "🟠",
    group: "ewallet",
    ewalletCode: "shopeepay",
  },
  {
    id: "EWallet_Dana",
    label: "DANA",
    desc: "Bayar menggunakan DANA",
    icon: "🟣",
    group: "ewallet",
    ewalletCode: "dana",
  },
  {
    id: "Card",
    label: "Kartu Debit / Kredit",
    desc: "Visa, Mastercard, dll",
    icon: "💳",
    group: "card",
  },
];

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Parse selected item IDs dari query
  const selectedIds = useMemo(() => {
    try {
      const raw = router.query.items;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((i) => i.id) : [];
    } catch {
      return [];
    }
  }, [router.query.items]);

  useEffect(() => {
    if (!router.isReady) return;
    fetchCart();
  }, [router.isReady]);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      // Filter hanya item yang terpilih dan memiliki produk
      const filtered = data.filter(
        (item) => selectedIds.includes(item.id) && item.product
      );
      setItems(filtered);

      // Auto-ambil notes dari item di keranjang
      const combinedNotes = filtered
        .filter((item) => item.note && item.note.trim())
        .map((item) => `${item.product?.name}: ${item.note.trim()}`);
      if (combinedNotes.length > 0) {
        setNote(combinedNotes.join(" | "));
      }

      setLoading(false);
    } catch (error) {
      console.error("Gagal load cart:", error);
      setLoading(false);
    }
  }

  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const ongkir = total >= 99000 ? 0 : 15000;
  const grandTotal = total + ongkir;

  async function handlePayment() {
    if (!address.trim()) return alert("Isi alamat pengiriman terlebih dahulu!");
    if (items.length === 0) return alert("Tidak ada item yang dipilih");

    // Tentukan paymentMethod dan detail pembayaran
    let paymentMethod = payment;
    let paymentDetail = "";

    if (payment.startsWith("Transfer_")) {
      paymentMethod = "Transfer";
      const bankName = payment.replace("Transfer_", "");
      paymentDetail = bankName;
    } else if (payment.startsWith("EWallet_")) {
      paymentMethod = "E-Wallet";
      const walletName = payment.replace("EWallet_", "");
      paymentDetail = walletName;
    }

    const payload = {
      address,
      note: note || null,
      paymentMethod,
      paymentDetail,
      items: items.map((item) => ({ id: item.id })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
        router.push("/checkout/success");
      } else {
        const err = await res.json();
        alert(err.message || "Checkout gagal");
      }
    } catch (error) {
      alert("Gagal terhubung ke server");
    }
  }

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
      <div className="checkout-page">
        <h4 className="mb-4 fw-bold">🧾 Checkout</h4>

        <div className="row g-4">
          {/* KIRI */}
          <div className="col-md-7">
            {/* Alamat */}
            <div className="card shadow-sm p-3 mb-3">
              <h6 className="fw-bold mb-2">📍 Alamat Pengiriman</h6>
              <textarea
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap (Jalan, Kota, Provinsi, Kode Pos)"
                rows={3}
              />
            </div>

            {/* Catatan untuk Penjual */}
            <div className="card shadow-sm p-3 mb-3">
              <h6 className="fw-bold mb-2">📝 Catatan untuk Penjual</h6>
              <textarea
                className="form-control"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Jangan terlalu manis, pakai separate"
                rows={2}
                maxLength={500}
              />
              <small className="text-secondary">{note.length}/500 karakter</small>
            </div>

            {/* Metode Pembayaran */}
            <div className="card shadow-sm p-3">
              <h6 className="fw-bold mb-3">💳 Metode Pembayaran</h6>

              <div className="payment-methods">
                {/* GROUP: Tunai */}
                <div className="payment-group">
                  <div className="payment-group-label">
                    <span className="badge bg-secondary">Tunai</span>
                  </div>
                  <label
                    className={`payment-card ${payment === "COD" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={payment === "COD"}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <div className="payment-card-content">
                      <div className="d-flex align-items-center gap-2">
                        <span className="payment-icon">🛵</span>
                        <span className="payment-label">COD (Bayar di Tempat)</span>
                      </div>
                      <small className="text-muted">
                        Bayar tunai saat barang diterima
                      </small>
                    </div>
                  </label>
                </div>

                {/* GROUP: Transfer Bank */}
                <div className="payment-group">
                  <div className="payment-group-label">
                    <span className="badge bg-primary">Transfer Bank</span>
                  </div>
                  {[
                    { id: "Transfer_BCA", label: "BCA", icon: "🏦" },
                    { id: "Transfer_Mandiri", label: "Mandiri", icon: "🏦" },
                    { id: "Transfer_BRI", label: "BRI", icon: "🏦" },
                    { id: "Transfer_BSI", label: "BSI", icon: "🏦" },
                  ].map((bank) => (
                    <label
                      key={bank.id}
                      className={`payment-card ${payment === bank.id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={bank.id}
                        checked={payment === bank.id}
                        onChange={(e) => setPayment(e.target.value)}
                      />
                      <div className="payment-card-content">
                        <div className="d-flex align-items-center gap-2">
                          <span className="payment-icon">{bank.icon}</span>
                          <span className="payment-label">
                            Transfer {bank.label}
                          </span>
                        </div>
                        <small className="text-muted">
                          Transfer via ATM / Internet Banking {bank.label}
                        </small>
                      </div>
                    </label>
                  ))}
                </div>

                {/* GROUP: E-Wallet */}
                <div className="payment-group">
                  <div className="payment-group-label">
                    <span className="badge bg-success">E-Wallet</span>
                  </div>
                  {[
                    {
                      id: "EWallet_GoPay",
                      label: "GoPay",
                      icon: "💚",
                      color: "#00C48C",
                    },
                    {
                      id: "EWallet_OVO",
                      label: "OVO",
                      icon: "🩷",
                      color: "#E60023",
                    },
                    {
                      id: "EWallet_ShopeePay",
                      label: "ShopeePay",
                      icon: "🟠",
                      color: "#FF6900",
                    },
                    {
                      id: "EWallet_Dana",
                      label: "DANA",
                      icon: "🟣",
                      color: "#5B4FCF",
                    },
                  ].map((wallet) => (
                    <label
                      key={wallet.id}
                      className={`payment-card ${payment === wallet.id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={wallet.id}
                        checked={payment === wallet.id}
                        onChange={(e) => setPayment(e.target.value)}
                      />
                      <div className="payment-card-content">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="payment-icon"
                            style={{
                              color: wallet.color,
                              fontSize: "1.4rem",
                            }}
                          >
                            {wallet.icon}
                          </span>
                          <span className="payment-label">{wallet.label}</span>
                        </div>
                        <small className="text-muted">
                          Bayar menggunakan {wallet.label}
                        </small>
                      </div>
                    </label>
                  ))}
                </div>

                {/* GROUP: Kartu */}
                <div className="payment-group">
                  <div className="payment-group-label">
                    <span className="badge bg-info text-dark">Kartu</span>
                  </div>
                  <label
                    className={`payment-card ${payment === "Card" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="Card"
                      checked={payment === "Card"}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <div className="payment-card-content">
                      <div className="d-flex align-items-center gap-2">
                        <span className="payment-icon">💳</span>
                        <span className="payment-label">
                          Kartu Debit / Kredit
                        </span>
                      </div>
                      <small className="text-muted">
                        Visa, Mastercard, dan lainnya
                      </small>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN — Ringkasan */}
          <div className="col-md-5">
            <div className="card shadow-sm p-3 sticky-top" style={{ top: "80px" }}>
              <h6 className="fw-bold mb-3">📋 Ringkasan Pesanan</h6>

              {items.length === 0 ? (
                <p className="text-secondary">Tidak ada item terpilih.</p>
              ) : (
                <>
                  <div className="order-items-list">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-start gap-2 mb-2 pb-2 border-bottom"
                      >
                        <img
                          src={item.product?.image || "/no-image.png"}
                          alt=""
                          width={50}
                          height={50}
                          style={{
                            objectFit: "cover",
                            borderRadius: "8px",
                            flexShrink: 0,
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">
                            {item.product?.name}
                          </div>
                          <div className="text-muted small">
                            x{item.quantity}
                            {item.note && (
                              <span className="d-block text-secondary">
                                💬 {item.note}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="fw-bold small text-end">
                          Rp{" "}
                          {(
                            (item.product?.price || 0) * item.quantity
                          ).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* Rincian Harga */}
                  <div className="price-breakdown">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Subtotal</span>
                      <span>Rp {total.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Ongkir</span>
                      <span>
                        {ongkir === 0 ? (
                          <span className="text-success">Gratis</span>
                        ) : (
                          `Rp ${ongkir.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold pt-2 border-top">
                      <span>Total</span>
                      <span className="text-danger fs-5">
                        Rp {grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Metode Pembayaran Terpilih */}
                  <div className="mt-3 p-2 bg-light rounded">
                    <small className="text-secondary">Metode Pembayaran:</small>
                    <div className="fw-bold small">
                      {(() => {
                        const m = PAYMENT_METHODS.find(
                          (m) => m.id === payment
                        );
                        return m ? `${m.icon} ${m.label}` : payment;
                      })()}
                    </div>
                  </div>

                  <button
                    className="btn btn-success w-100 mt-3 py-3 fw-bold"
                    onClick={handlePayment}
                    style={{ fontSize: "1.1rem", borderRadius: "12px" }}
                  >
                    ✅ Bayar Sekarang — Rp {grandTotal.toLocaleString()}
                  </button>

                  <small className="text-muted text-center d-block mt-2">
                    Data dikirim secara aman dan terenkripsi
                  </small>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          padding-bottom: 40px;
        }
        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .payment-group-label {
          margin-bottom: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .payment-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .payment-card {
          display: block;
          position: relative;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
          margin: 0;
        }
        .payment-card:hover {
          border-color: #4c6ef5;
          background: #f8f9ff;
        }
        .payment-card.selected {
          border-color: #4c6ef5;
          background: #eef2ff;
          box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.15);
        }
        .payment-card input[type="radio"] {
          position: absolute;
          top: 12px;
          right: 14px;
          width: 18px;
          height: 18px;
          accent-color: #4c6ef5;
          cursor: pointer;
        }
        .payment-card-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .payment-icon {
          font-size: 1.3rem;
          width: 28px;
          text-align: center;
        }
        .payment-label {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .order-items-list {
          max-height: 350px;
          overflow-y: auto;
        }
        .price-breakdown {
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .payment-card input[type="radio"] {
            top: 50%;
            transform: translateY(-50%);
          }
        }
      `}</style>
    </Layout>
  );
}