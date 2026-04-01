// pages/admin/index.js (tetap sama, tapi quick actions udah nggak perlu di sini)
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchProducts();
    }
  }, [status]);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal menghapus produk");
        return;
      }

      alert("Produk berhasil dihapus");
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Terjadi error saat menghapus produk");
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <Layout stats={[]}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-pink" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <Layout stats={[]}>
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Akses Ditolak!</h4>
          <p>Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      title: "Total Cakes",
      value: products.length,
      icon: "🍰",
      color: "#ff9f9f",
      bgColor: "#fff5f5",
      trend: "+2"
    },
    {
      title: "Orders Today",
      value: "12",
      icon: "🛍️",
      color: "#9f9fff",
      bgColor: "#f5f5ff",
      trend: "+5"
    },
    {
      title: "Total Customers",
      value: "156",
      icon: "👥",
      color: "#9fff9f",
      bgColor: "#f5fff5",
      trend: "+8"
    },
    {
      title: "Revenue",
      value: "Rp 2.5M",
      icon: "💰",
      color: "#ffbf9f",
      bgColor: "#fff5f0",
      trend: "+15%"
    }
  ];

  return (
    <Layout stats={stats}>
      {/* PRODUCTS SECTION - FULL WIDTH NOW! */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h4 className="fw-bold mb-1">Cake Products</h4>
              <p className="text-secondary mb-0">
                Total {filteredProducts.length} produk tersedia
              </p>
            </div>
            
            {/* SEARCH BAR */}
            <div className="d-flex gap-2">
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary">🔍</span>
                <input
                  type="text"
                  className="form-control rounded-pill ps-5"
                  placeholder="Search cakes..."
                  style={{ width: "250px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <span style={{ fontSize: "5rem", opacity: 0.3 }}>🍰</span>
              <p className="text-secondary mt-3">Belum ada produk tersedia</p>
              <Link href="/admin/products/create" className="btn btn-pink rounded-pill px-4 mt-2">
                + Add Your First Cake
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-md-6 col-xl-4">
                  <div className="card h-100 border-0 shadow-sm rounded-4 hover-scale">
                    <div className="position-relative">
                      <img
                        src={product.image || "/default-cake.jpg"}
                        className="card-img-top rounded-top-4"
                        alt={product.name}
                        style={{ height: "180px", objectFit: "cover" }}
                        onError={(e) => (e.target.src = "/default-cake.jpg")}
                      />
                      <span className="position-absolute top-0 end-0 m-3 badge bg-white text-dark shadow-sm">
                        Stok: 10
                      </span>
                    </div>
                    
                    <div className="card-body">
                      <h6 className="fw-bold mb-2 text-truncate" title={product.name}>
                        {product.name}
                      </h6>
                      
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-warning me-2">★★★★★</span>
                        <small className="text-secondary">(24)</small>
                      </div>
                      
                      <p className="fw-bold text-pink mb-3">
                        Rp {product.price?.toLocaleString()}
                      </p>
                      
                      <div className="d-flex gap-2">
                        <Link 
                          href={`/admin/products/edit/${product.id}`}
                          className="btn btn-outline-primary rounded-pill flex-grow-1 btn-sm"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger rounded-pill flex-grow-1 btn-sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        
        .btn-pink {
          background: linear-gradient(135deg, #ff9f9f 0%, #ff6b6b 100%);
          border: none;
          color: white;
          transition: all 0.3s ease;
        }
        .btn-pink:hover {
          background: linear-gradient(135deg, #ff8f8f 0%, #ff5b5b 100%);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255,107,107,0.4);
          color: white;
        }
        
        .text-pink {
          color: #ff6b6b;
        }
        
        .rounded-4 {
          border-radius: 1rem !important;
        }
      `}</style>
    </Layout>
  );
}