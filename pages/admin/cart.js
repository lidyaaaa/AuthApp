import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function AdminCartPage() {
  const { data: session, status } = useSession();

  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCarts();
    }
  }, [status]);

  async function fetchCarts() {
    try {
      const res = await fetch("/api/admin/cart");
      const data = await res.json();
      setCarts(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
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

  if (session?.user?.role !== "admin") {
    return (
      <Layout>
        <div className="alert alert-danger text-center">
          Akses ditolak
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-transparent border-0 p-4">
          <h4 className="fw-bold mb-1">🛒 Cart Monitoring</h4>
          <p className="text-secondary mb-0">
            Semua aktivitas user di cart
          </p>
        </div>

        <div className="card-body p-4">
          {carts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-secondary">Belum ada aktivitas cart</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Waktu</th>
                  </tr>
                </thead>

                <tbody>
                  {carts.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">
                        {item.user?.name || "-"}
                      </td>

                      <td className="text-muted">
                        {item.user?.email}
                      </td>

                      <td>
                        {item.product?.name}
                      </td>

                      <td>
                        <span className="badge bg-dark">
                          {item.quantity}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            item.status === "active"
                              ? "bg-warning text-dark"
                              : "bg-success"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="text-muted">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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