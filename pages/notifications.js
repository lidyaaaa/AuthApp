import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    fetchNotifs();
  }, []);

  async function fetchNotifs() {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifs(data);
  }

  async function markAsRead(id) {
    await fetch(`/api/notifications/${id}`, {
      method: "PUT",
    });

    fetchNotifs();

    // 🔥 update badge di navbar
    window.dispatchEvent(new Event("notifUpdated"));
  }

  return (
    <Layout>
      <h4>Notifications 🔔</h4>

      {notifs.length === 0 ? (
        <p>Tidak ada notifikasi</p>
      ) : (
        <div className="card p-3">
          {notifs.map((notif) => (
            <div
              key={notif.id}
              className={`border-bottom py-2 ${
                !notif.isRead ? "fw-bold" : ""
              }`}
            >
              <div>{notif.message}</div>

              {!notif.isRead && (
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => markAsRead(notif.id)}
                >
                  Tandai dibaca
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}