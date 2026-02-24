import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* NAVBAR */}
      <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
        <div>
          <h2 className="fw-bold mb-0">Dashboard</h2>
          {session && (
            <small className="text-muted">
              Welcome back, {session.user.email}
            </small>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">

          {/* ✅ USER → tombol cart */}
          {session && session.user.role === "user" && (
            <Link href="/cart" className="btn btn-primary btn-sm">
              🛒 Cart
            </Link>
          )}

          {/* ✅ ADMIN → tambah produk */}
          {session?.user?.role === "admin" && (
            <Link href="/admin/products/create" className="btn btn-success btn-sm">
              + Tambah Produk
            </Link>
          )}

          {/* LOGOUT */}
          {session && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <main className="flex-grow-1 p-4">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-light text-center py-3 mt-auto">
        &copy; {new Date().getFullYear()} Kayzhaakies. All rights reserved.
      </footer>
    </div>
  );
}