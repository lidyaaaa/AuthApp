import { getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/AdminLayout";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menyimpan produk");
      }

      router.push("/dashboard/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <h1 style={styles.title}>Create Product</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* NAMA */}
        <div style={styles.field}>
          <label style={styles.label}>Nama Produk</label>
          <input
            type="text"
            placeholder="Contoh: Laptop ASUS"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* HARGA */}
        <div style={styles.field}>
          <label style={styles.label}>Harga</label>
          <input
            type="number"
            placeholder="Contoh: 15000000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </form>
    </AdminLayout>
  );
}

const styles = {
  title: {
    marginBottom: "16px",
  },
  form: {
    background: "#fff",
    padding: "24px",
    maxWidth: "420px",
    borderRadius: "8px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  },
  label: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "12px",
  },
};