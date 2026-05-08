import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(""); // 🔥 TAMBAHAN
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
    setStock(data.stock); // 🔥
    setImage(data.image || "");
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
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
        stock: Number(stock), // 🔥
        image,
      }),
    });

    setLoading(false);
    router.push("/admin/dashboard");
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container py-5">
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* 🔥 INPUT STOCK */}
        <input
          type="number"
          className="form-control mb-3"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input type="file" onChange={uploadImage} />

        {image && <img src={image} style={{ width: "100%" }} />}

        <button className="btn btn-primary">
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}