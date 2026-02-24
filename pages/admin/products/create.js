import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
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

      if (!res.ok) {
        alert("Upload gambar gagal");
        setUploading(false);
        return;
      }

      const data = await res.json();
      setImage(data.path);
      setUploading(false);
    } catch (error) {
      console.log(error);
      alert("Terjadi error saat upload");
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
      alert("Upload gambar dulu ya");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          image,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan produk");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch (error) {
      console.log(error);
      alert("Terjadi error");
      setLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Add New Product</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Product Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={uploadImage}
                required
              />
              {uploading && <small>Uploading...</small>}
            </div>

            {image && (
              <img
                src={image}
                style={{ width: "100%", height: 200, objectFit: "cover" }}
                className="mb-3"
              />
            )}

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push("/admin/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || uploading}
              >
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}