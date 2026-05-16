import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Gagal load notifikasi:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      // Perbarui badge di navbar
      window.dispatchEvent(new Event("notifUpdated"));
    } catch (error) {
      console.error("Gagal tandai baca:", error);
    }
  }

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      window.dispatchEvent(new Event("notifUpdated"));
    } catch (error) {
      console.error("Gagal tandai semua:", error);
    }
  }

  async function deleteNotification(id) {
    try {
      await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      window.dispatchEvent(new Event("notifUpdated"));
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="spinner-border" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="notifications-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">🔔 Notifikasi</h4>
          <div className="d-flex gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={markAllAsRead}
              >
                Tandai Semua Dibaca
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="mb-3"
              style={{ fontSize: "4rem", opacity: 0.3 }}
            >
              🔔
            </div>
            <p className="text-secondary">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-card ${
                  !notif.isRead ? "unread" : ""
                }`}
              >
                <div className="d-flex align-items-start gap-3">
                  <div className="notification-icon-wrapper">
                    <span
                      className="notification-icon"
                      style={{
                        backgroundColor:
                          notif.type === "stock_out"
                            ? "#fff3cd"
                            : notif.type === "warning"
                            ? "#fff3cd"
                            : "#e8f5e9",
                        color:
                          notif.type === "stock_out"
                            ? "#856404"
                            : notif.type === "warning"
                            ? "#856404"
                            : "#2e7d32",
                      }}
                    >
                      {notif.type === "stock_out"
                        ? "⚠️"
                        : notif.type === "warning"
                        ? "⚠️"
                        : "ℹ️"}
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h6
                        className={`mb-1 ${
                          !notif.isRead ? "fw-bold" : "fw-normal"
                        }`}
                      >
                        {notif.title}
                      </h6>
                      {!notif.isRead && (
                        <span className="badge bg-primary small">Baru</span>
                      )}
                    </div>
                    <p className="text-muted small mb-1">{notif.message}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-secondary">
                        {new Date(notif.createdAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                      <div className="d-flex gap-1">
                        {!notif.isRead && (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => markAsRead(notif.id)}
                          >
                            Tandai Baca
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteNotification(notif.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .notifications-page {
          max-width: 700px;
          margin: 0 auto;
          padding-bottom: 40px;
        }
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .notification-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s ease;
          cursor: default;
        }
        .notification-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .notification-card.unread {
          border-left: 4px solid #4c6ef5;
          background: #f8f9ff;
        }
        .notification-icon-wrapper {
          flex-shrink: 0;
        }
        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        @media (max-width: 576px) {
          .notification-card {
            padding: 12px;
          }
        }
      `}</style>
    </Layout>
  );
}