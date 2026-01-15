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

    setSuccess("Akun berhasil dibuat! Mengarahkan ke halaman login...");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center register-container">
      <div className="register-wrapper">
        <div className="register-content">
          {/* Left side - Decorative */}
          <div className="register-decoration-section">
            <div className="decoration-content">
              <h2 className="fw-bold mb-4">Bergabung Dengan Kami</h2>
              <div className="features-list">
                <div className="feature-item d-flex align-items-center mb-3">
                  <div className="feature-icon me-3">✓</div>
                  <span>Akses dashboard lengkap</span>
                </div>
                <div className="feature-item d-flex align-items-center mb-3">
                  <div className="feature-icon me-3">✓</div>
                  <span>Analitik terperinci</span>
                </div>
                <div className="feature-item d-flex align-items-center mb-3">
                  <div className="feature-icon me-3">✓</div>
                  <span>Dukungan 24/7</span>
                </div>
                <div className="feature-item d-flex align-items-center">
                  <div className="feature-icon me-3">✓</div>
                  <span>Keamanan terenkripsi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="register-form-section">
            <div className="register-header">
              <h1 className="fw-bold">Buat Akun Baru</h1>
              <p className="text-muted">Isi data diri Anda untuk mulai bergabung</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              {error && (
                <div className="alert alert-danger mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success mb-4">
                  {success}
                </div>
              )}

              <div className="form-group mb-4">
                <label className="form-label fw-semibold mb-2">Nama Lengkap</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

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

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-semibold mb-2">Password</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Minimal 6 karakter"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-semibold mb-2">Konfirmasi Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      className="form-control"
                      placeholder="Ulangi password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  required
                />
                <label className="form-check-label" htmlFor="terms">
                  Saya menyetujui{' '}
                  <a href="#" className="text-decoration-none text-primary">Syarat & Ketentuan</a>
                  {' '}dan{' '}
                  <a href="#" className="text-decoration-none text-primary">Kebijakan Privasi</a>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Membuat Akun...
                  </>
                ) : "Daftar Sekarang"}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                Sudah punya akun?{' '}
                <a href="/login" className="text-decoration-none fw-semibold text-primary">
                  Masuk di sini
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
          padding: 20px;
        }
        
        .register-wrapper {
          width: 100%;
          max-width: 1100px;
        }
        
        .register-content {
          display: flex;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          min-height: 650px;
        }
        
        .register-decoration-section {
          flex: 1;
          background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
          padding: 60px 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .register-form-section {
          flex: 1.2;
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .register-header h1 {
          color: #1a1a1a;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        
        .register-header p {
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
          margin-top: 30px;
        }
        
        .feature-item {
          font-size: 1.1rem;
          padding: 10px 0;
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
        
        .form-check-input {
          width: 20px;
          height: 20px;
          margin-top: 0.2rem;
        }
        
        .form-check-input:checked {
          background-color: #0052cc;
          border-color: #0052cc;
        }
        
        .form-check-input:focus {
          border-color: #0052cc;
          box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
        }
        
        .alert-danger {
          background-color: rgba(255, 71, 87, 0.1);
          border: 1px solid rgba(255, 71, 87, 0.2);
          color: #ff4757;
          border-radius: 12px;
          padding: 12px 16px;
        }
        
        .alert-success {
          background-color: rgba(0, 184, 148, 0.1);
          border: 1px solid rgba(0, 184, 148, 0.2);
          color: #00b894;
          border-radius: 12px;
          padding: 12px 16px;
        }
        
        @media (max-width: 992px) {
          .register-content {
            flex-direction: column;
            min-height: auto;
          }
          
          .register-form-section,
          .register-decoration-section {
            padding: 40px 30px;
          }
          
          .register-decoration-section {
            order: -1;
            min-height: 200px;
          }
        }
        
        @media (max-width: 768px) {
          .register-header h1 {
            font-size: 2rem;
          }
          
          .register-form-section,
          .register-decoration-section {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}