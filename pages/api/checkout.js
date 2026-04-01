// pages/api/checkout.js

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

    if (req.method === "POST") {
      const { address, note, paymentMethod } = req.body;

      if (!address) {
        return res.status(400).json({ message: "Alamat wajib diisi" });
      }

      // ambil cart user
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
      });

      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart kosong" });
      }

      console.log("CHECKOUT:", {
        userId,
        address,
        note,
        paymentMethod,
        items: cartItems,
      });

      // 🔥 hapus semua cart user setelah checkout
      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });

  } catch (error) {
    console.log("CHECKOUT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}