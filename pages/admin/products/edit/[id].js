import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch product when ID is available
  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        const data = await res.json();
        return alert(data.message || "Product not found");
      }
      const data = await res.json();
      setProduct(data);
      setName(data.name);
      setPrice(data.price);
    } catch (err) {
      console.error(err);
      alert("Gagal ambil produk");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price) }),
      });

      if (!res.ok) {
        const data = await res.json();
        return alert(data.message || "Gagal update produk");
      }

      alert("Produk berhasil diupdate");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update");
    } finally {
      setLoading(false);
    }
  }

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="container py-5">
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama produk"
          required
        />
        <input
          type="number"
          className="form-control mb-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Harga"
          required
        />

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
