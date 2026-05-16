import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function UserOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/user/orders");
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border" />
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="text-center py-5">
          <p className="text-secondary">Belum ada pesanan.</p>
          <Link href="/user/products" className="btn btn-pink">
            Belanja Sekarang
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h4 className="fw-bold mb-4">My Orders 📦</h4>
      <div className="row g-4">
        {orders.map((order) => (
          <div key={order.id} className="col-12">
            <div className="card shadow-sm rounded-4">
              <div className="card-body">
<div className="d-flex justify-content-between align-items-center mb-3">
                   <div>
                     <small className="text-secondary">Order #{order.id}</small>
                     <div className="fw-bold">Rp {order.total.toLocaleString()}</div>
                   </div>
                   <div className="text-end">
                     <span className={`badge ${order.status === 'pending' ? 'bg-warning text-dark' : order.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>
                       {order.status}
                     </span>
                     <div className="small text-secondary">
                       {new Date(order.createdAt).toLocaleDateString()}
                     </div>
                   </div>
                 </div>
                 {order.paymentMethod && (
                   <div className="mb-2">
                     <small className="text-secondary">Metode Pembayaran:</small>
                     <span className="fw-semibold ms-1">{order.paymentDetail ? `${order.paymentMethod} (${order.paymentDetail})` : order.paymentMethod}</span>
                   </div>
                 )}
                 {order.note && (
                  <div className="mb-3">
                    <small className="text-secondary">Catatan Pesanan:</small>
                    <p className="mb-0 fst-italic">{order.note}</p>
                  </div>
                )}
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th>Produk</th>
                        <th>Qty</th>
                        <th>Catatan</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product?.name || "Produk tidak tersedia"}</td>
                          <td>{item.quantity}</td>
                          <td>
                            {item.note ? (
                              <small className="text-secondary">{item.note}</small>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>Rp {item.price.toLocaleString()}</td>
                          <td>Rp {(item.quantity * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
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
