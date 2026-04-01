import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function UserDashboard() {
  const { status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  async function handleAddToCart(productId) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Cakes", icon: "🍰" },
    { id: "birthday", name: "Birthday", icon: "🎂" },
    { id: "wedding", name: "Wedding", icon: "💒" },
    { id: "cupcake", name: "Cupcakes", icon: "🧁" },
  ];

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div
            className="spinner-border text-pink"
            style={{ width: "3rem", height: "3rem" }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Our Delicious Cakes 🎂</h4>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Search cakes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* CATEGORIES */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`btn rounded-pill ${
              selectedCategory === cat.id
                ? "btn-pink text-white"
                : "btn-outline-secondary"
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-secondary">
          Produk tidak ditemukan
        </p>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4">
              <div className="card h-100 shadow-sm rounded-4">
                
                {/* 🔥 TAMBAHAN STOK DI ATAS GAMBAR */}
                <div className="position-relative">
                  <img
                    src={product.image || "/default-cake.jpg"}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <span className="position-absolute top-0 end-0 m-2 badge bg-white text-dark shadow-sm">
                    Stok: {product.stock ?? 0}
                  </span>
                </div>

                <div className="card-body">
                  <h6 className="fw-bold">{product.name}</h6>
                  <p className="text-secondary small">
                    {product.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-pink">
                      Rp {product.price?.toLocaleString()}
                    </span>

                    <button
                      className="btn btn-pink rounded-circle"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0} // 🔥 disable kalau habis
                    >
                      🛒
                    </button>
                  </div>

                  {/* 🔥 OPTIONAL: teks kalau stok habis */}
                  {product.stock === 0 && (
                    <small className="text-danger">Stok habis</small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .btn-pink {
          background: #ff6b6b;
          color: white;
          border: none;
        }
        .text-pink {
          color: #ff6b6b;
        }
      `}</style>
    </Layout>
  );
}