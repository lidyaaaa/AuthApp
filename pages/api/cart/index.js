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

    // ================= ADD TO CART =================
    if (req.method === "POST") {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Product ID wajib" });
      }

      const existing = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId: Number(productId),
        },
      });

      // kalau sudah ada → tambah quantity
      if (existing) {
        const updated = await prisma.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: {
              increment: 1, // 🔥 lebih clean dari +1 manual
            },
          },
        });

        return res.status(200).json(updated);
      }

      // kalau belum ada → create baru
      const item = await prisma.cartItem.create({
        data: {
          userId,
          productId: Number(productId),
          quantity: 1,
        },
      });

      return res.status(201).json(item);
    }

    // ================= GET CART =================
    if (req.method === "GET") {
      const items = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(items);
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });

  } catch (error) {
    console.log("CART ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}