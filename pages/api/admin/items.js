import { useEffect, useState } from "react";

export default function ItemsAdmin() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadItems = async () => {
    const res = await fetch("/api/admin/items");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const addItem = async () => {
    await fetch("/api/admin/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setTitle("");
    setDescription("");
    loadItems();
  };

  const deleteItem = async (id) => {
    await fetch(`/api/admin/items/${id}`, {
      method: "DELETE",
    });
    loadItems();
  };

  return (
    <div>
      <h1>CRUD Item</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button onClick={addItem}>Tambah</button>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            <b>{item.title}</b> – {item.description}
            <button onClick={() => deleteItem(item.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
