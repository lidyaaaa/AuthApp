import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Harus login" });
    }

    const userId = session.user.id;

    if (req.method === "GET") {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(notifications);
    }

    if (req.method === "PUT") {
      const { id } = req.body;

      if (id) {
        // Tandai satu notifikasi sebagai sudah dibaca
        await prisma.notification.update({
          where: { id },
          data: { isRead: true },
        });
      } else {
        // Tandai semua sebagai sudah dibaca
        await prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });
      }

      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;

      if (id) {
        await prisma.notification.delete({ where: { id } });
      } else {
        await prisma.notification.deleteMany({ where: { userId } });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error) {
    console.log("NOTIFICATION ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}