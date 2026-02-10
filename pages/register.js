import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak sama");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registrasi gagal");
      setLoading(false);
      return;
    }

    setSuccess("Akun berhasil dibuat! Mengarahkan ke login...");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-card">
        <h2>Buat Akun</h2>
        <p className="subtitle">Daftar untuk mulai menggunakan sistem</p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <input name="name" type="text" placeholder="Nama lengkap" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password (min. 6 karakter)" required />
        <input name="confirmPassword" type="password" placeholder="Ulangi password" required />

        <button type="submit" disabled={loading}>
          {loading ? "Mendaftarkan..." : "Daftar"}
        </button>

        <button
          type="button"
          className="login-btn"
          onClick={() => router.push("/login")}
        >
          Sudah punya akun? Login
        </button>
      </form>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f6f8;
          padding: 20px;
        }

        .register-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
        }

        h2 {
          margin-bottom: 6px;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 24px;
          font-size: 0.9rem;
        }

        input {
          margin-bottom: 14px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 0.95rem;
        }

        input:focus {
          outline: none;
          border-color: #4c6ef5;
        }

        button {
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: #4c6ef5;
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-btn {
          background: transparent;
          color: #4c6ef5;
          border: 1px solid #4c6ef5;
        }

        .login-btn:hover {
          background: #eef2ff;
        }

        .error {
          background: #ffe3e3;
          color: #c92a2a;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 14px;
          font-size: 0.9rem;
          text-align: center;
        }

        .success {
          background: #e6fcf5;
          color: #099268;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 14px;
          font-size: 0.9rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
