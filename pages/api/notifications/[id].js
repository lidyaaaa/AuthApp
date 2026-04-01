// pages/api/notifications/[id].js

let notifications = [
  {
    id: 1,
    message: "Pesanan kamu berhasil dibuat 🎉",
    isRead: false,
  },
  {
    id: 2,
    message: "Ada promo diskon hari ini!",
    isRead: false,
  },
];

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    notifications = notifications.map((notif) =>
      notif.id == id ? { ...notif, isRead: true } : notif
    );

    res.status(200).json({ success: true });
  }
}