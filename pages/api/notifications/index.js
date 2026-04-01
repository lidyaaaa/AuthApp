// pages/api/notifications/index.js

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
  if (req.method === "GET") {
    res.status(200).json(notifications);
  }
}