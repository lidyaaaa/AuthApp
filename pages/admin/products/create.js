import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(""); // 🔥 TAMBAHAN
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImage(data.path);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) return alert("Upload gambar dulu");

    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock), // 🔥 TAMBAHAN
          image,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Add New Product</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            {/* 🔥 INPUT STOCK */}
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />

            <input
              type="file"
              className="form-control mb-3"
              onChange={uploadImage}
            />

            {image && <img src={image} style={{ width: "100%" }} />}

            <button className="btn btn-primary w-100">
              {loading ? "Saving..." : "Save Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}