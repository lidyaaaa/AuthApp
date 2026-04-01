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

    // ================= DELETE =================
    if (req.method === "DELETE") {
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

    // ================= UPDATE QUANTITY =================
    if (req.method === "PUT") {
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({ message: "Quantity wajib" });
      }

      const item = await prisma.cartItem.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!item) {
        return res.status(404).json({ message: "Item tidak ditemukan" });
      }

      // kalau quantity <= 0 → hapus item
      if (quantity <= 0) {
        await prisma.cartItem.delete({
          where: { id },
        });

        return res.json({ message: "Item dihapus" });
      }

      const updated = await prisma.cartItem.update({
        where: { id },
        data: {
          quantity,
        },
      });

      return res.json(updated);
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}