import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const addProduct = async () => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    location.reload();
  };

  const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    location.reload();
  };

  return (
    <div>
      <h1>Product CRUD</h1>

      <input placeholder="Nama" onChange={e => setName(e.target.value)} />
      <input placeholder="Harga" onChange={e => setPrice(e.target.value)} />
      <button onClick={addProduct}>Tambah</button>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - {p.price}
            <button onClick={() => deleteProduct(p.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
