import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("COD");
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data);
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function handlePayment() {
    if (!address) return alert("Isi alamat dulu!");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        note,
        paymentMethod: payment,
      }),
    });

    if (res.ok) {
      // 🔥 update icon cart
      window.dispatchEvent(new Event("cartUpdated"));

      // 🔥 kosongin state biar UI langsung kosong
      setItems([]);

      router.push("/checkout/success");
    }
  }

  return (
    <Layout>
      <h4 className="mb-4">Checkout 🧾</h4>

      <div className="row">
        <div className="col-md-7">
          <div className="card p-3 mb-3">
            <h6>Alamat Pengiriman</h6>
            <textarea
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap..."
            />
          </div>

          <div className="card p-3 mb-3">
            <h6>Note untuk penjual</h6>
            <textarea
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: jangan terlalu manis"
            />
          </div>

          <div className="card p-3">
            <h6>Metode Pembayaran</h6>

            <select
              className="form-select"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option value="COD">COD</option>
              <option value="Transfer">Transfer Bank</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-3">
            <h6>Ringkasan Pesanan</h6>

            {items.map((item) => (
              <div key={item.id} className="d-flex justify-content-between">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>
                  Rp{" "}
                  {(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <hr />

            <h5>Total: Rp {total.toLocaleString()}</h5>

            <button
              className="btn btn-success w-100 mt-3"
              onClick={handlePayment}
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}