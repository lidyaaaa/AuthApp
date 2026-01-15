import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔒 CEGAH AKSES LOGIN JIKA SUDAH AUTH
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard"); // ⬅️ bukan push
    }
  }, [status, router]);

  // ⏳ nunggu session
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
      router.replace("/dashboard"); // ⬅️ replace biar ga bisa back
    } else {
      setError("Email atau password salah");
    }
  };


  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center login-container">
      <div className="login-wrapper">
        <div className="login-content">
          {/* Left side - Form */}
          <div className="login-form-section">
            <div className="login-header">
              <h1 className="fw-bold">Selamat Datang</h1>
              <p className="text-muted">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              {error && (
                <div className="alert alert-danger mb-4">
                  {error}
                </div>
              )}

              <div className="form-group mb-4">
                <label className="form-label fw-semibold mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="contoh@email.com"
                  required
                />
              </div>

              <div className="form-group mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-semibold">Password</label>
                  <a href="#" className="text-decoration-none text-primary small">Lupa password?</a>
                </div>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Masukkan password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Memproses...
                  </>
                ) : "Masuk"}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                Belum punya akun?{' '}
                <a href="/register" className="text-decoration-none fw-semibold text-primary">
                  Daftar di sini
                </a>
              </p>
            </div>
          </div>

          {/* Right side - Decorative */}
          <div className="login-decoration-section">
            <div className="decoration-content">
              <h2 className="fw-bold mb-4">Platform Management</h2>
              <div className="features-list">
                <div className="feature-item d-flex align-items-center mb-3">
                  <div className="feature-icon me-3">✓</div>
                  <span>Dashboard interaktif</span>
                </div>
                <div className="feature-item d-flex align-items-center mb-3">
                  <div className="feature-icon me-3">✓</div>
                  <span>Analitik real-time</span>
                </div>
                <div className="feature-item d-flex align-items-center">
                  <div className="feature-icon me-3">✓</div>
                  <span>Keamanan terjamin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
          padding: 20px;
        }
        
        .login-wrapper {
          width: 100%;
          max-width: 1000px;
        }
        
        .login-content {
          display: flex;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          min-height: 600px;
        }
        
        .login-form-section {
          flex: 1;
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .login-decoration-section {
          flex: 1;
          background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
          padding: 60px 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .login-header h1 {
          color: #1a1a1a;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        
        .login-header p {
          font-size: 1.1rem;
          color: #666;
        }
        
        .form-control {
          border: 2px solid #e1e8f0;
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 1rem;
          transition: all 0.3s;
        }
        
        .form-control:focus {
          border-color: #0052cc;
          box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          transition: all 0.3s;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 82, 204, 0.2);
        }
        
        .btn-primary:disabled {
          opacity: 0.7;
          transform: none;
          box-shadow: none;
        }
        
        .decoration-content {
          max-width: 400px;
        }
        
        .decoration-content h2 {
          font-size: 2.2rem;
          line-height: 1.3;
        }
        
        .features-list {
          margin-top: 40px;
        }
        
        .feature-item {
          font-size: 1.1rem;
          padding: 12px 0;
        }
        
        .feature-icon {
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .alert-danger {
          background-color: rgba(255, 71, 87, 0.1);
          border: 1px solid rgba(255, 71, 87, 0.2);
          color: #ff4757;
          border-radius: 12px;
          padding: 12px 16px;
        }
        
        @media (max-width: 992px) {
          .login-content {
            flex-direction: column;
            min-height: auto;
          }
          
          .login-form-section,
          .login-decoration-section {
            padding: 40px 30px;
          }
          
          .login-decoration-section {
            order: -1;
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
}