import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.replace("/dashboard");
    } else {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>Login</h2>
        <p className="subtitle">Masuk untuk melanjutkan</p>

        {error && <div className="error">{error}</div>}

        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />

        <button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>

        {/* Tombol ke Register */}
        <button
          type="button"
          className="register-btn"
          onClick={() => router.push("/register")}
        >
          Buat Akun Baru
        </button>
      </form>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f6f8;
          padding: 20px;
        }

        .login-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 380px;
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

        .register-btn {
          background: transparent;
          color: #4c6ef5;
          border: 1px solid #4c6ef5;
        }

        .register-btn:hover {
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
      `}</style>
    </div>
  );
}
