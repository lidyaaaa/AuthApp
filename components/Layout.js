// components/Layout.js
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Layout({ children, stats = [] }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  const navigation = [
    { name: "Dashboard", href: "/", icon: "📊", roles: ["admin", "user"] },
    { name: "Products", href: "/products", icon: "🍰", roles: ["user"] },
    { name: "My Orders", href: "/orders", icon: "📦", roles: ["user"] },
    { name: "Admin Dashboard", href: "/admin", icon: "⚙️", roles: ["admin"] },
    { name: "Manage Products", href: "/admin/products", icon: "📝", roles: ["admin"] },
    { name: "Categories", href: "/admin/categories", icon: "🏷️", roles: ["admin"] },
  ];

  const filteredNav = navigation.filter(
    (item) => session && item.roles.includes(session.user.role)
  );

  // 🔥 FETCH CART
  async function fetchCartCount() {
    try {
      if (!session) return;

      const res = await fetch("/api/cart");
      const data = await res.json();

      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch (err) {
      console.log(err);
    }
  }

  // 🔥 FETCH NOTIF
  async function fetchNotifCount() {
    try {
      if (!session) return;

      const res = await fetch("/api/notifications");
      const data = await res.json();

      const unread = data.filter((n) => !n.isRead).length;
      setNotifCount(unread);
    } catch (err) {
      console.log(err);
    }
  }

  // 🔥 LOAD AWAL + SETIAP SESSION BERUBAH
  useEffect(() => {
    fetchCartCount();
    fetchNotifCount();
  }, [session]);

  // 🔥 REALTIME CART (INI YANG PENTING)
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [session]);

  // 🔥 REALTIME NOTIF
  useEffect(() => {
    const handleNotifUpdate = () => {
      fetchNotifCount();
    };

    window.addEventListener("notifUpdated", handleNotifUpdate);

    return () => {
      window.removeEventListener("notifUpdated", handleNotifUpdate);
    };
  }, [session]);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* SIDEBAR */}
      <div className={`sidebar bg-white shadow-lg ${isSidebarOpen ? "open" : ""}`}>
        <div className="p-4 border-bottom">
          <h5 className="fw-bold">Kayzhaakies 🎂</h5>
          <small>{session?.user?.role}</small>
        </div>

        <div className="p-3">
          <nav className="nav flex-column gap-2">
            {filteredNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${
                  router.pathname === item.href ? "active" : ""
                }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-3 mt-auto">
          <button
            className="btn btn-danger w-100"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* NAVBAR */}
        <div className="bg-white p-3 shadow-sm d-flex justify-content-between">
          <button
            className="btn btn-light d-lg-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>

          <div className="d-flex gap-3 align-items-center ms-auto">
            {/* CART */}
            {session?.user?.role === "user" && (
              <Link href="/cart" className="position-relative btn btn-outline-dark">
                🛒
                {cartCount > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* NOTIFICATION */}
            <Link href="/notifications" className="btn btn-outline-dark position-relative">
              🔔
              {notifCount > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {notifCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <main className="flex-grow-1 p-4">
          {children}
        </main>

        <footer className="bg-white p-3 text-center border-top">
          © {new Date().getFullYear()} Kayzhaakies
        </footer>
      </div>

      <style jsx>{`
        .sidebar {
          width: 250px;
        }
        @media (max-width: 992px) {
          .sidebar {
            position: fixed;
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }
        .nav-link.active {
          font-weight: bold;
          color: red;
        }
      `}</style>
    </div>
  );
}