import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  async function fetchProduct() {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();

    setProduct(data);
    setName(data.name);
    setPrice(data.price);
    setImage(data.image || "");
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImage(data.path);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        image,
      }),
    });

    setLoading(false);
    router.push("/dashboard");
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

        <input type="file" className="form-control mb-3" onChange={uploadImage} />

        {image && (
          <img
            src={image}
            style={{ width: "100%", height: 200, objectFit: "cover" }}
            className="mb-3"
          />
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}