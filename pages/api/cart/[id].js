import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Harus login" });
    }

    const userId = session.user.id;
    const id = Number(req.query.id);

    if (req.method === "DELETE") {
      // pastikan item milik user sendiri
      const item = await prisma.cartItem.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!item) {
        return res.status(404).json({ message: "Item tidak ditemukan" });
      }

      await prisma.cartItem.delete({
        where: { id },
      });

      return res.json({ message: "Item dihapus" });
    }

    res.status(405).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}